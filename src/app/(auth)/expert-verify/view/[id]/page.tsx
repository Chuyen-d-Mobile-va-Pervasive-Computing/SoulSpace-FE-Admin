"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { getExpertById } from "@/lib/api";
import { toast } from "sonner";
import ImageZoom from "@/components/ImageZoom";

export default function ExpertViewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [expert, setExpert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
            <Button variant="destructive">Reject</Button>
            <Button variant="default">Approve</Button>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
