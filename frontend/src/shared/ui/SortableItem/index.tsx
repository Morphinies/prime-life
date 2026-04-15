import React from 'react';
// import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface SortableItemProps {
  id: string;
  isOff?: boolean;
  children: React.ReactNode;
  sortable?: ReturnType<typeof useSortable>;
}

export function SortableItem({ id, children, isOff, sortable }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    sortable || useSortable({ id });

  const style = {
    transition,
    opacity: isDragging ? 0.6 : 1,
    // transform: CSS.Transform.toString(transform),
    cursor: isDragging ? 'grabbing' : sortable ? 'default' : 'pointer',
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
  };

  if (isOff) return children;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...(sortable ? {} : listeners)}>
      {children}
    </div>
  );
}
