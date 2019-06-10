// Dependencies:
import { tsquery } from '@phenomnomnominal/tsquery';
import { tstemplate } from '@phenomnomnominal/tstemplate';
import {
  Node,
  visitNode,
  visitEachChild,
  SourceFile,
  TransformationContext,
  Transformer,
  TransformerFactory,
  ClassDeclaration
} from 'typescript';
import { buildNode } from './buildNode';

// Constants:
const CAST_PROPERTIES_QUERY = `ClassDeclaration:has(Decorator:has(Identifier[name="HtmlComponent"]))`;
const RESULT_QUERY = 'PropertyDeclaration';

const TEMPATE_EXPRESSION_TEMPLATE = tstemplate.compile(`
    class Template {
        public template = <%= node %>;
    }
`);

export function transformer(source: SourceFile): TransformerFactory<Node> {
  const castProperties = tsquery(source, CAST_PROPERTIES_QUERY);
  return htmlComponentDecoratorToGetterFactory(castProperties);
}

export function htmlComponentDecoratorToGetterFactory(
  nodes: Array<Node>
): TransformerFactory<Node> {
  return function(context: TransformationContext): Transformer<Node> {
    return function(node: Node): Node {
      return visitNode(node, visit);
    };

    function visit(node: Node): Node | Array<Node> {
      node = visitEachChild(node, visit, context);
      if (nodes.includes(node)) {
        // Create the base structure of the new getter/setter:
        const classDeclaration = node as ClassDeclaration;
        const [internal] = tsquery(TEMPATE_EXPRESSION_TEMPLATE({
            node: buildNode(classDeclaration)
        }), RESULT_QUERY);

        // Return the new AST nodes to replace the old one:
        return [internal];
      }
      return node;
    }
  };
}
