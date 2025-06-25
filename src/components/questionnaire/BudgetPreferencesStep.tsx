import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { questions } from './questionScript/Script';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Checkbox } from "@/components/ui/checkbox";

interface BudgetPreferencesStepProps {
  data: any;
  onDataChange: (data: any) => void;
}

interface SortablePriorityItemProps {
  priority: {
    id: string;
    label: string;
    description: string;
  };
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}

const SortablePriorityItem: React.FC<SortablePriorityItemProps> = ({ priority, isSelected, onToggle, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: priority.id });

  const style = {
    transform: transform ? `translateY(${transform.y}px)` : undefined,
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 cursor-move transition-all duration-200 hover:shadow-md ${
        isSelected ? 'border-rose-400 bg-rose-50 shadow-md' : 'border-gray-200 hover:border-rose-300'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-600 font-semibold text-sm">
            {index + 1}
          </span>
          <span className="font-medium text-gray-900">{priority.label}</span>
        </div>
        <div className="text-sm text-gray-500">
          {isSelected && '✓'}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2 ml-9">{priority.description}</p>
    </Card>
  );
};

const BudgetPreferencesStep: React.FC<BudgetPreferencesStepProps> = ({ data, onDataChange }) => {
  const [priorityItems, setPriorityItems] = useState(questions.priorities);
  const [isPriorityConfirmed, setIsPriorityConfirmed] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    // 초기 로드 시 저장된 순서와 확인 상태 복원
    if (data.priorityOrder) {
      const orderedItems = [...priorityItems].sort((a, b) => {
        return data.priorityOrder.indexOf(a.id) - data.priorityOrder.indexOf(b.id);
      });
      setPriorityItems(orderedItems);
    }
    // 저장된 확인 상태 복원
    setIsPriorityConfirmed(!!data.isPriorityConfirmed);
  }, []);

  const handleBudgetChange = (budget: string) => {
    onDataChange({
      ...data,
      budget
    });
  };

  const handleAreaToggle = (areaId: string) => {
    const currentAreas = data.treatmentAreas || [];
    const updatedAreas = currentAreas.includes(areaId)
      ? currentAreas.filter((id: string) => id !== areaId)
      : [...currentAreas, areaId];
    
    onDataChange({
      ...data,
      treatmentAreas: updatedAreas
    });
  };

  const handlePriorityChange = (priority: string) => {
    const currentPriorities = data.priority || [];
    const updatedPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter((id: string) => id !== priority)
      : [...currentPriorities, priority];

    onDataChange({
      ...data,
      priority: updatedPriorities
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setPriorityItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // 순서가 변경되면 확인 상태 해제하고 데이터도 업데이트
        setIsPriorityConfirmed(false);
        onDataChange({
          ...data,
          isPriorityConfirmed: false, // 데이터에도 확인 상태 해제 반영
          priorityOrder: null // 순서 데이터도 초기화
        });
        
        return newItems;
      });
    }
  };

  const handlePriorityConfirm = (checked: boolean) => {
    setIsPriorityConfirmed(checked);
    onDataChange({
      ...data,
      isPriorityConfirmed: checked,
      // 체크된 경우에만 우선순위 순서 저장, 해제된 경우 null로 초기화
      priorityOrder: checked ? priorityItems.map(item => item.id) : null
    });
  };

  return (
    <div className="space-y-8">
      {/* Budget Range */}
      <div>
        <Label className="text-lg font-medium text-gray-800 mb-4 block">
          What's your budget range for treatment?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {questions.budgetRanges.map((range) => (
            <Card
              key={range.id}
              className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                data.budget === range.id
                  ? 'border-rose-400 bg-rose-50 shadow-md'
                  : 'border-gray-200 hover:border-rose-300'
              }`}
              onClick={() => handleBudgetChange(range.id)}
            >
              <h3 className="font-medium text-gray-900 mb-1">{range.label}</h3>
              <p className="text-sm text-gray-600">{range.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Treatment Areas */}
      <div>
        <Label className="text-lg font-medium text-gray-800 mb-4 block">
          Which areas would you like to focus on? (Select all that apply)
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {questions.treatmentAreas.map((area) => (
            <Card
              key={area.id}
              className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md text-center ${
                (data.treatmentAreas || []).includes(area.id)
                  ? 'border-rose-400 bg-rose-50 shadow-md'
                  : 'border-gray-200 hover:border-rose-300'
              }`}
              onClick={() => handleAreaToggle(area.id)}
            >
              {/* <div className="text-2xl mb-2">{area.emoji}</div> */}
              <span className="font-medium text-gray-900 text-sm">{area.label}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Priorities */}
      <div>
        <Label className="text-lg font-medium text-gray-800 mb-4 block">
          What matters most to you? (Drag to reorder by priority)
        </Label>
        <div className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={priorityItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {priorityItems.map((priority, index) => (
                <SortablePriorityItem
                  key={priority.id}
                  priority={priority}
                  isSelected={false}
                  onToggle={() => {}}
                  index={index}
                />
              ))}
            </SortableContext>
          </DndContext>
          
          <div className="flex items-center space-x-2 pt-4">
            <Checkbox
              id="priority-confirm"
              checked={isPriorityConfirmed}
              onCheckedChange={handlePriorityConfirm}
            />
            <label
              htmlFor="priority-confirm"
              className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Please check this box when you have finalized the priority order
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPreferencesStep;
