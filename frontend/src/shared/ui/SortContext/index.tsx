import {
  useSensor,
  useSensors,
  DndContext,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface SortContextProps<T> {
  id?: string;
  items: T[];
  children: React.ReactNode;
  setItems?: React.Dispatch<React.SetStateAction<T[]>>;
  handleReorder: (items: T[], oldIndex: number, newIndex: number) => void;
}

export function SortContext<T extends { id: string }>({
  id = 'sort-list',
  items,
  children,
  handleReorder,
}: SortContextProps<T>) {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        handleReorder(items, oldIndex, newIndex);
      }
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  return (
    <DndContext
      id={id}
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
