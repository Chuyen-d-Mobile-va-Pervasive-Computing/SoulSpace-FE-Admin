"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="container mx-auto p-1">
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Expert Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Avatar + Basic Info */}
          <section>
            <h2 className="font-semibold mb-3">Basic Information</h2>
            <div className="flex items-center gap-5">
              <img
                src="https://i.pravatar.cc/40?img=25"
                alt="Avatar"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <p className="text-lg font-semibold">Dr. John Doe</p>
                <p className="text-[16px] text-muted-foreground">
                  Phone Number: 0909 123 456
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Bio */}
          <section>
            <h2 className="font-semibold mb-3">Bio</h2>
            <p className="text-[16px] text-muted-foreground leading-relaxed">
              Specialist with over 10 years of experience in the field of
              dermatology. Worked at many large hospitals and currently works at
              ABC clinic...
            </p>
          </section>

          <Separator />

          {/* Clinic + Location */}
          <section>
            <h2 className="font-semibold mb-3">Clinic Information</h2>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Clinic:</span> Clinic ABC
              </p>
              <p>
                <span className="font-medium">Location:</span> 123 Le Loi,
                District 1, TP. HCM
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
                {[1, 2, 3].map((item) => (
                  <img
                    key={item}
                    src="https://i.pravatar.cc/40?img=43"
                    alt="Certificate"
                    className="h-20 w-20 rounded-md"
                  />
                ))}
              </div>
            </ScrollArea>
          </section>

          <Separator />

          {/* Schedule */}
          <section>
            <h2 className="font-semibold mb-3">Schedule</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { day: "Mon", time: "08:00 - 17:00" },
                { day: "Tue", time: "08:00 - 17:00" },
                { day: "Wed", time: "Absence" },
                { day: "Thu", time: "08:00 - 17:00" },
                { day: "Fri", time: "08:00 - 17:00" },
                { day: "Sat", time: "09:00 - 12:00" },
              ].map((s, idx) => (
                <Card key={idx} className="p-3 border">
                  <p className="font-medium">{s.day}</p>
                  <p className="text-sm text-muted-foreground">{s.time}</p>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Buttons */}
          <section className="flex justify-end gap-4 pt-2 pb-4">
            <Button variant="destructive">Reject</Button>
            <Button variant={"default"}>Approve</Button>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
