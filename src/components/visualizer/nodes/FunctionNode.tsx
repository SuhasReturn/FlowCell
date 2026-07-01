import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { FunctionNodeData } from '../../../types';

interface FunctionNodeComponentProps {
  data: FunctionNodeData;
}

function FunctionNodeComponent({ data }: FunctionNodeComponentProps) {
  return (
    <div className="function-node">
      <Handle type="target" position={Position.Left} className="handle-dot" />
      <div className="node-header">
        <span className="node-icon">ƒ</span>
        <span className="node-type-label">function</span>
      </div>
      <div className="node-name">{data.label}</div>
      {data.params.length > 0 && (
        <div className="node-params">
          ({data.params.join(', ')})
        </div>
      )}
      <Handle type="source" position={Position.Right} className="handle-dot" />
    </div>
  );
}

export const FunctionNode = memo(FunctionNodeComponent);
