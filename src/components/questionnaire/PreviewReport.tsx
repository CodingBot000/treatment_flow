import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { steps } from './questionScript/Script';

interface PreviewReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Record<string, any>;
}

const PreviewReport: React.FC<PreviewReportProps> = ({ open, onOpenChange, formData }) => {
  const getStepSummary = (stepId: string, data: any) => {
    if (!data) return '아직 입력되지 않음';

    switch (stepId) {
      case 'skin-concerns':
        return (
          <div className="space-y-2">
            <p><strong>피부 타입:</strong> {data.skinType}</p>
            <p><strong>피부 고민:</strong> {data.concerns?.join(', ')}</p>
          </div>
        );
      
      case 'budget-preferences':
        return (
          <div className="space-y-2">
            <p><strong>예산 범위:</strong> {data.budget}</p>
            <p><strong>관리 부위:</strong> {data.treatmentAreas?.join(', ')}</p>
            <p><strong>우선순위:</strong> {data.priorityOrder?.join(' > ')}</p>
          </div>
        );
      
      case 'treatment-goals':
        return (
          <div className="space-y-2">
            <p><strong>치료 목표:</strong> {data.goals?.join(', ')}</p>
            <p><strong>시작 시기:</strong> {data.timeframe}</p>
            <p><strong>이전 치료 경험:</strong> {data.pastTreatments?.join(', ')}</p>
            {data.additionalNotes && (
              <p><strong>추가 메모:</strong> {data.additionalNotes}</p>
            )}
          </div>
        );
      
      case 'health-condition':
        return (
          <div className="space-y-2">
            <p><strong>건강 상태:</strong> {data.healthConditions?.join(', ')}</p>
          </div>
        );
      
      case 'visitPaths':
        return (
          <div className="space-y-2">
            <p><strong>방문 경로:</strong> {data.visitPath}</p>
          </div>
        );
      
      case 'basic-info':
        return (
          <div className="space-y-2">
            <p><strong>이름:</strong> {data.name}</p>
            <p><strong>연락처:</strong> {data.phoneNumber}</p>
            <p><strong>이메일:</strong> {data.email}</p>
          </div>
        );
      
      default:
        return '데이터 없음';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-center mb-4">
            상담 신청 내용 미리보기
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 p-4">
            {steps.map((step) => (
              <Card key={step.id} className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {step.title}
                </h3>
                <div className="text-gray-600">
                  {getStepSummary(step.id, formData[step.id])}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewReport; 