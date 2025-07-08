"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangePasswordForm from "@/modules/auth/changePassword";
// import ChangePasswordForm from "@/modules/auth/changePassword";
export const ProfilePage = () => {
  const [firstName, setFirstName] = useState("Sahil");
  const [lastName, setLastName] = useState("Rattan");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");

  const handleSave = () => {
    console.log("Profile saved");
  };

  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full  h-auto p-0 border-b-0   roundedjustify-start gap-8">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:primary data-[state=inactive]:text-gray-700 rounded pb-3 px-0 font-medium text-base hover:primary transition-colors"
            >
              My profile
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:primary data-[state=inactive]:text-gray-700 rounded pb-3 px-0 font-medium text-base hover:primarytransition-colors"
            >
              Preferences
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:primary data-[state=inactive]:text-gray-700 rounded pb-3 px-0 font-medium text-base hover:primary transition-colors"
            >
              Integrations
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:primary data-[state=inactive]:text-gray-700 rounded pb-3 px-0 font-medium text-base hover:primary transition-colors"
            >
              Security
            </TabsTrigger>
          </TabsList>
          <div className="border-b border-gray-200 -mt-px"></div>

          <TabsContent value="profile" className="mt-8">
            <div className="space-y-8">
              {/* User Info Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 bg-orange-500">
                  <AvatarFallback className="bg-orange-500 text-white text-xl font-semibold">
                    S
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold ">Sahil Rattan</h2>
                  <p>
                    sahilrattan79@gmail.com{" "}
                    <button className="text-blue-600 hover:underline text-sm ml-2">
                      change email
                    </button>
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium ">
                      First name
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium ">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium ">
                      Country
                    </Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="in">India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium ">
                      Phone
                    </Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 border-gray-300  rounded-l-md">
                        <span className=" text-sm">+000</span>
                      </div>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="000 000 00 00"
                        className="border-gray-300 rounded-l-none focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium ">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium ">Birthday</Label>
                    <div className="flex gap-2">
                      <Input
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        placeholder="Day"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Select value={month} onValueChange={setMonth}>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="01">January</SelectItem>
                          <SelectItem value="02">February</SelectItem>
                          <SelectItem value="03">March</SelectItem>
                          <SelectItem value="04">April</SelectItem>
                          <SelectItem value="05">May</SelectItem>
                          <SelectItem value="06">June</SelectItem>
                          <SelectItem value="07">July</SelectItem>
                          <SelectItem value="08">August</SelectItem>
                          <SelectItem value="09">September</SelectItem>
                          <SelectItem value="10">October</SelectItem>
                          <SelectItem value="11">November</SelectItem>
                          <SelectItem value="12">December</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div>
                <Button
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                >
                  Save
                </Button>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold ">Delete account</h3>
                <p className=" text-sm mb-4">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>

                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <div className="py-12 text-center text-gray-500">
              Preferences content coming soon...
            </div>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="py-12 text-center text-gray-500">
              Integrations content coming soon...
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="pt-8 border-t  items-start border-gray-200">
              <ChangePasswordForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default ProfilePage;
