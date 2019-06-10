import { createPrinter, transform, SourceFile} from 'typescript';
import { transformer } from './lib/transformer';

export function transformFile (file: SourceFile): string {
    const result = transform(file, [transformer(file)]);
    const [transformed] = result.transformed;
    const printer = createPrinter();
    return printer.printFile(transformed as SourceFile);
}
