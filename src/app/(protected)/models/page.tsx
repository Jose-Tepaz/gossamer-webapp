/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  EllipsisVertical,
  Plus,
  Edit,
  Copy,
  Trash2,
  Play,
  AlertCircle,
  Loader2,
} from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { useModels, UserModel } from "@/hooks/useModels"
import { useBrokerConnections } from "@/hooks/useBrokerConnections"
import { useBrokerModels } from "@/hooks/useBrokerModels"






function HeaderIntro({ onCreateModel }: { onCreateModel: () => void }) {
  return (
    <Card className="rounded-xl border bg-white" style={{ borderColor: "#eeeeee" }}>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-xl md:text-2xl">Model Portfolios</CardTitle>
            <p className="text-sm text-[#444] mt-1 max-w-3xl">
              A model portfolio is a group of assets and target allocations that are designed to meet a particular
              investing goal. Once you create a model, you can apply it to a portfolio. Gossamer will help you keep your
              portfolio in line with your model.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="text-white"
              style={{ backgroundColor: "#872eec" }}
              onClick={onCreateModel}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add new model
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More">
                  <EllipsisVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Import</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

interface ModelRowProps {
  model: UserModel;
  brokerConnections: any[];
  onApply: (modelId: string, brokerId: string) => void;
  onEdit: (modelId: string) => void;
  onDuplicate: (modelId: string) => void;
  onDelete: (modelId: string) => void;
}

function ModelRow({ model, brokerConnections, onApply, onDuplicate, onDelete }: ModelRowProps) {
  const [showApplyMenu, setShowApplyMenu] = useState(false);
  const { assignedModels, getAssignedModelForBroker, unassignModel, loading: assignmentLoading } = useBrokerModels();
  
  console.log('🔍 ModelRow - model:', model.name);
  console.log('🔍 ModelRow - brokerConnections:', Object.keys(brokerConnections));
  console.log('🔍 ModelRow - assignedModels:', assignedModels);

  const handleApply = (brokerId: string) => {
    onApply(model.id, brokerId);
    setShowApplyMenu(false);
  };

  const handleUnassign = async (brokerId: string) => {
    try {
      console.log(`🔄 Unassigning model from broker ${brokerId}`);
      const success = await unassignModel(brokerId);
      
      if (success) {
        console.log(`✅ Model unassigned from broker ${brokerId}`);
        // Refresh the page to update the UI
        window.location.reload();
      } else {
        console.error(`❌ Failed to unassign model from broker ${brokerId}`);
      }
    } catch (error) {
      console.error('Error unassigning model:', error);
    }
  };

  return (
    <Card className="rounded-xl border bg-white" style={{ borderColor: "#eeeeee" }}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-base">{model.name}</h3>
              <Badge variant={model.is_global ? "default" : "secondary"}>
                {model.is_global ? "Global" : "Broker Specific"}
                {model.broker_id && ` - ${model.broker_id.charAt(0).toUpperCase() + model.broker_id.slice(1)}`}
              </Badge>
              {(() => {
                const assignedModel = assignedModels.find(am => am.model_id === model.id);
                return assignedModel && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    ✓ Assigned to {assignedModel.broker_id.charAt(0).toUpperCase() + assignedModel.broker_id.slice(1)}
                  </Badge>
                );
              })()}
            </div>
            {model.description && (
              <p className="text-sm text-gray-600 mb-2">{model.description}</p>
            )}
            <div className="text-xs text-gray-500">
              {model.model_data?.assets?.length || 0} assets • 
              Created {new Date(model.created_at).toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu open={showApplyMenu} onOpenChange={setShowApplyMenu}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={assignmentLoading}>
                  {assignmentLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Apply
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {brokerConnections.length === 0 ? (
                  <DropdownMenuItem disabled>
                    No brokers connected
                  </DropdownMenuItem>
                ) : (
                  brokerConnections.map((brokerId) => {
                    const assignedModelForBroker = getAssignedModelForBroker(brokerId);
                    const isAssigned = assignedModelForBroker?.model_id === model.id;
                    const brokerName = brokerId.charAt(0).toUpperCase() + brokerId.slice(1);
                    
                    return (
                      <DropdownMenuItem
                        key={brokerId}
                        onClick={() => isAssigned ? handleUnassign(brokerId) : handleApply(brokerId)}
                        className={isAssigned ? "text-green-600" : ""}
                      >
                        {isAssigned ? (
                          <>
                            <span className="text-green-600">✓</span>
                            <span className="ml-2">Unassign from {brokerName}</span>
                          </>
                        ) : (
                          `Apply to ${brokerName}`
                        )}
                      </DropdownMenuItem>
                    );
                  })
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm" asChild>
              <Link href={`/models/edit?modelId=${model.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="More">
                  <EllipsisVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDuplicate(model.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(model.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ModelsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { models, loading: modelsLoading, error: modelsError, loadModels, deleteModel } = useModels();
  const { connectedBrokers, isHydrated: connectionsHydrated } = useBrokerConnections();
  const { assignModel, loadAllAssignedModels } = useBrokerModels();
  
  // const [applyingModel, setApplyingModel] = useState<string | null>(null);

  const handleApplyModel = useCallback(async (modelId: string, brokerId: string) => {
    try {
      console.log(`🔄 Applying model ${modelId} to broker ${brokerId}`);
      console.log(`🔍 User ID:`, user?.id);
      const success = await assignModel(brokerId, modelId);
      
      if (success) {
        console.log(`✅ Model ${modelId} applied to broker ${brokerId}`);
        // Refresh assignments to update UI
        console.log(`🔄 Refreshing assignments...`);
        await loadAllAssignedModels();
        console.log(`✅ Assignments refreshed`);
        // Redirect to broker page to see the changes
        router.push(`/broker/${brokerId}`);
      } else {
        console.error(`❌ Failed to apply model ${modelId} to broker ${brokerId}`);
      }
    } catch (error) {
      console.error('Error applying model:', error);
    }
  }, [assignModel, loadAllAssignedModels, router, user?.id]);

  // Load models on mount
  useEffect(() => {
    if (user?.id && connectionsHydrated) {
      console.log('🔄 Loading models and assignments...');
      loadModels();
      loadAllAssignedModels();
    }
  }, [user?.id, connectionsHydrated, loadModels, loadAllAssignedModels]);

  // Handle broker_id from URL (when coming from broker page)
  useEffect(() => {
    const brokerId = searchParams.get('broker_id');
    if (brokerId && models.length > 0) {
      // Auto-apply first model to the specified broker
      const firstModel = models[0];
      if (firstModel) {
        handleApplyModel(firstModel.id, brokerId);
      }
    }
  }, [searchParams, models, handleApplyModel]);

  const handleCreateModel = () => {
    router.push('/models/edit');
  };


  const handleEditModel = (modelId: string) => {
    router.push(`/models/edit?modelId=${modelId}`);
  };

  const handleDuplicateModel = async (modelId: string) => {
    try {
      const model = models.find(m => m.id === modelId);
      if (model) {
        // TODO: Implement duplicate logic
        console.log('Duplicating model:', model);
      }
    } catch (error) {
      console.error('Error duplicating model:', error);
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    if (confirm('Are you sure you want to delete this model?')) {
      try {
        await deleteModel(modelId);
        loadModels(); // Refresh the list
      } catch (error) {
        console.error('Error deleting model:', error);
      }
    }
  };

  // Show loading state
  if (!connectionsHydrated || modelsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading models...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (modelsError) {
    return (
      <div className="space-y-4">
        <HeaderIntro onCreateModel={handleCreateModel} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading models: {modelsError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      <HeaderIntro onCreateModel={handleCreateModel} />
      
      {models.length === 0 ? (
        <Card className="rounded-xl border bg-white" style={{ borderColor: "#eeeeee" }}>
          <CardContent className="py-8 text-center">
            <div className="text-gray-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold mb-2">No models created yet</h3>
              <p className="text-sm">Create your first model portfolio to get started.</p>
            </div>
            <Button
              className="text-white"
              style={{ backgroundColor: "#872eec" }}
              onClick={handleCreateModel}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first model
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {models.map((model) => (
            <ModelRow
              key={model.id}
              model={model}
              brokerConnections={connectedBrokers}
              onApply={handleApplyModel}
              onEdit={handleEditModel}
              onDuplicate={handleDuplicateModel}
              onDelete={handleDeleteModel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
