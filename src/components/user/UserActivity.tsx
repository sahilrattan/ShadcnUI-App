"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { UserService } from "@/api/services/UserService";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
interface UserActivityDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

interface UserActivityVM {
  activityID?: string | null;
  userID?: string | null;
  activityType?: string | null;
  description?: string | null;
  timestamp?: string;
}

export const UserActivityDialog = ({
  open,
  onClose,
  userId,
}: UserActivityDialogProps) => {
  const [activity, setActivity] = useState<UserActivityVM[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await UserService.getUserActivity("1", userId);
        if (res.data) {
          const transformed: UserActivityVM[] = res.data.map((item: any) => ({
            activityID: item.userActivityLogId,
            userID: item.userId,
            activityType: item.actionName,
            description: item.actionName,
            timestamp: item.createdDate,
          }));
          setActivity(transformed);
        }
      } catch (err) {
        toast.error("Failed to load user activity");
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchActivity();
  }, [userId, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Activity</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : activity.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No activity found.
            </div>
          ) : (
            <ScrollArea className="max-h-[60vh] pr-2">
              <ul className="space-y-4">
                {activity.map((item, index) => (
                  <Card key={index} className="mb-2 px-3 py-2 shadow-sm">
                    <div className="space-y-1 text-sm leading-tight">
                      <div>
                        <span className="font-medium">
                          User Activity Log ID:
                        </span>{" "}
                        {item.activityID}
                      </div>
                      <div>
                        <span className="font-medium">User ID:</span>{" "}
                        {item.userID}
                      </div>
                      <div>
                        <span className="font-medium">Action Name:</span>{" "}
                        {item.activityType}
                      </div>
                      <div>
                        <span className="font-medium">Created Date:</span>{" "}
                        {new Date(item.timestamp || "").toLocaleString()}
                      </div>
                    </div>
                  </Card>
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
