import { bootstrap } from 'faster-dom';
import { createSimpleFor } from './app/components/simpleFor';
import { createExampleAttr } from './app/components/attrs';
import { createCounter } from './app/components/simpleCounter';
import { createStyles } from './app/components/styles';
import { createNestedFor } from './app/components/nestedFor';
import { createSimpleForAfterFor } from './app/components/simpleForAfterFor';
import { createCounterFor } from './app/components/counterFor';
import './app/components/sharedCounter';
import { createCounterSharedFor } from './app/components/counterSharedFor';

bootstrap('#styles', createStyles);

bootstrap('#attrs', createExampleAttr);

bootstrap('#counter', createCounter);

bootstrap('#simple_for_component', createSimpleFor);

bootstrap('#nested_for_component', createNestedFor);

bootstrap('#for_after_for', createSimpleForAfterFor);

bootstrap('#counter_for', createCounterFor);

bootstrap('#counter_shared_for', createCounterSharedFor);
