import { useState } from 'react'
import { IndexNode } from '@/types/api'
import { cn } from '@/lib/utils'

interface TreeViewProps {
  data: IndexNode
  onSelectFile: (path: string) => void
  selectedPath?: string
  className?: string
}

export function TreeView({ data, onSelectFile, selectedPath, className }: TreeViewProps) {
  return (
    <div className={cn('overflow-auto', className)}>
      <TreeNode 
        node={data} 
        onSelectFile={onSelectFile} 
        selectedPath={selectedPath}
        level={0}
      />
    </div>
  )
}

interface TreeNodeProps {
  node: IndexNode
  onSelectFile: (path: string) => void
  selectedPath?: string
  level: number
}

function TreeNode({ node, onSelectFile, selectedPath, level }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(level < 1)
  const isSelected = node.path === selectedPath
  const indent = `${level * 16}px`
  
  const toggleExpanded = () => {
    if (node.type === 'dir') {
      setExpanded(!expanded)
    }
  }
  
  const handleClick = () => {
    if (node.type === 'dir') {
      toggleExpanded()
    } else {
      onSelectFile(node.path)
    }
  }
  
  return (
    <div>
      <div 
        className={cn(
          'flex items-center py-1 px-2 cursor-pointer hover:bg-accent hover:text-accent-foreground',
          isSelected && 'bg-accent text-accent-foreground'
        )}
        style={{ paddingLeft: indent }}
        onClick={handleClick}
      >
        {node.type === 'dir' ? (
          <span className="mr-1">{expanded ? '📂' : '📁'}</span>
        ) : (
          <span className="mr-1">📄</span>
        )}
        <span className="truncate">{node.name}</span>
      </div>
      
      {node.type === 'dir' && expanded && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode
              key={`${child.path}-${index}`}
              node={child}
              onSelectFile={onSelectFile}
              selectedPath={selectedPath}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
