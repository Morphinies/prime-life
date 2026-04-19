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
  list: T[];
  children: React.ReactNode;
  handleReorder: (list: T[], oldIndex: number, newIndex: number) => void;
}

export function SortContext<T extends { id: string; sortOrder: number }>({
  id = 'sort-list',
  list,
  children,
  handleReorder,
}: SortContextProps<T>) {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = list.findIndex((item) => item.id === active.id);
      const newIndex = list.findIndex((item) => item.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        handleReorder(list, oldIndex, newIndex);
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
      <SortableContext items={list} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
