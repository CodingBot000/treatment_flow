
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { questions } from './questionScript/Script';

interface VisitPathStepProps {
  data: any;
  onDataChange: (data: any) => void;
}

const VisitPathStep: React.FC<VisitPathStepProps> = ({ data, onDataChange }) => {
  const handleVisitPathChange = (visitPath: string) => {
    onDataChange({
      ...data,
      visitPath
    });
  };


  return (
    <div className="space-y-8">
      {/* Budget Range */}
      <div>
        <Label className="text-lg font-medium text-gray-800 mb-4 block">
           How did you hear about us? 
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {questions.visitPaths.map((visitPath) => (
            <Card
              key={visitPath.id}
              className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                data.visitPath === visitPath.id
                  ? 'border-rose-400 bg-rose-50 shadow-md'
                  : 'border-gray-200 hover:border-rose-300'
              }`}
              onClick={() => handleVisitPathChange(visitPath.id)}
            >
              <h3 className="font-medium text-gray-900 mb-1">{visitPath.label}</h3>
              <p className="text-sm text-gray-600">{visitPath.description}</p>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};

export default VisitPathStep;
