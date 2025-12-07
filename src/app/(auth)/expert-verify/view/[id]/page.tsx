"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { getExpertById, approveExpert, rejectExpert } from "@/lib/api";
import { toast } from "sonner";
import ImageZoom from "@/components/ImageZoom";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function ExpertViewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [expert, setExpert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [rejectReason, setRejectReason] = useState("");
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  const REJECT_OPTIONS = [
    "Information is incomplete",
    "Invalid certificate",
    "Suspicious account activity",
    "Unverified clinic address",
    "Provided details do not match records",
  ];

  const handleApprove = async () => {
    try {
      await approveExpert(expert.profile_id);
      toast.success("Expert approved successfully!");

      setExpert((prev: any) => ({ ...prev, status: "approved" }));
      router.push("/expert-verify");
    } catch (err: any) {
      toast.error(err.message || "Failed to approve expert.");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }

    try {
      await rejectExpert(expert.profile_id, rejectReason);
      toast.success("Expert rejected successfully!");

      setExpert((prev: any) => ({ ...prev, status: "rejected" }));
      setOpenRejectDialog(false);
      setRejectReason("");
      router.push("/expert-verify");
    } catch (err: any) {
      toast.error(err.message || "Failed to reject expert.");
    }
  };

  useEffect(() => {
    if (!id) return;

    const loadExpert = async () => {
      try {
        const res = await getExpertById(id);

        console.log("EXPERT DETAIL:", res);

        setExpert(res);
      } catch (err: any) {
        toast.error(err.message || "Failed to load expert.");
      } finally {
        setLoading(false);
      }
    };

    loadExpert();
  }, [id]);

  if (loading) return <p className="p-5">Loading...</p>;
  if (!expert) return <p className="p-5">Expert not found.</p>;

  return (
    <div className="container mx-auto p-1">
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Expert Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Basic Info */}
          <section>
            <h2 className="font-semibold mb-3">Basic Information</h2>

            <div className="flex items-center gap-5">
              <ImageZoom
                src={
                  expert.avatar_url ||
                  "https://ui-avatars.com/api/?name=" + expert.full_name
                }
                alt="Avatar"
                className="h-20 w-20 rounded-full object-cover"
              />

              <div>
                <p className="text-lg font-semibold">{expert.full_name}</p>
                <p className="text-[16px] text-muted-foreground">
                  Phone Number: {expert.phone || "N/A"}
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Bio */}
          <section>
            <h2 className="font-semibold mb-3">Bio</h2>
            <p className="text-[16px] text-muted-foreground leading-relaxed">
              {expert.bio || "No bio available."}
            </p>
          </section>

          <Separator />

          {/* Clinic Information */}
          <section>
            <h2 className="font-semibold mb-3">Clinic Information</h2>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Clinic:</span>{" "}
                {expert.clinic_name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {expert.clinic_address || "N/A"}
              </p>
            </div>
          </section>

          <Separator />

          {/* Credit Card */}
          <section>
            <h2 className="font-semibold mb-3">Credit Card</h2>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Visa •••• 4242</Badge>
            </div>
          </section>

          <Separator />

          {/* Certificates */}
          <section>
            <h2 className="font-semibold mb-3">Certificates</h2>

            <ScrollArea className="h-32 w-full rounded border p-3">
              <div className="flex gap-4">
                {expert.certificate_url ? (
                  <ImageZoom
                    src={expert.certificate_url}
                    alt="Certificate"
                    className="h-28 w-28 rounded-md object-cover"
                  />
                ) : (
                  <p className="text-sm text-gray-500">No certificates.</p>
                )}
              </div>
            </ScrollArea>
          </section>

          <Separator />

          {/* Status */}
          <section>
            <h2 className="font-semibold mb-3">Status</h2>

            {(() => {
              const status = expert.status;

              const color =
                status === "approved"
                  ? "text-green-600 bg-green-100"
                  : status === "pending"
                    ? "text-yellow-600 bg-yellow-100"
                    : "text-red-600 bg-red-100";

              return (
                <span
                  className={`px-3 py-1 rounded-md text-sm font-medium ${color}`}
                >
                  {status}
                </span>
              );
            })()}
          </section>

          <Separator />

          {/* Buttons */}
          <section className="flex justify-end gap-4 pt-2 pb-4">
            {expert.status === "pending" && (
              <>
                {/* Reject Dialog */}
                <Dialog
                  open={openRejectDialog}
                  onOpenChange={setOpenRejectDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive">Reject</Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Expert</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-gray-600">
                      Please provide a reason for rejection:
                    </p>

                    <Input
                      placeholder="Enter rejection reason..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />

                    <div className="flex flex-wrap gap-2 mt-3">
                      {REJECT_OPTIONS.map((reason) => (
                        <button
                          key={reason}
                          className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
                          onClick={() => setRejectReason(reason)}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setOpenRejectDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleReject}>
                        Confirm Reject
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Approve */}
                <Button variant="default" onClick={handleApprove}>
                  Approve
                </Button>
              </>
            )}

            {expert.status !== "pending" && (
              <p className="text-gray-400 italic">
                This expert has already been processed.
              </p>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
