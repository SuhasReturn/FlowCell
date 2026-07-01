import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { VariableNodeData } from '../../../types';

interface VariableNodeComponentProps {
  data: VariableNodeData;
}

function VariableNodeComponent({ data }: VariableNodeComponentProps) {
  return (
    <div className="variable-node">
      <Handle type="target" position={Position.Left} className="handle-dot" />
      <div className="node-header">
        <span className="node-icon">x</span>
        <span className="node-type-label">{data.varKind}</span>
      </div>
      <div className="node-name">{data.label}</div>
      <div className="node-init-type">{data.initType}</div>
      <Handle type="source" position={Position.Right} className="handle-dot" />
    </div>
  );
}

export const VariableNode = memo(VariableNodeComponent);
