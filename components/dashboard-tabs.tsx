"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileTab from "@/components/profile-tab"
import ShipmentsTab from "@/components/shipments-tab"
import AddressesTab from "@/components/addresses-tab"
import CreateShipmentTab from "@/components/create-shipment-tab"
import { User, Package, MapPin, PlusCircle } from "lucide-react"

interface DashboardTabsProps {
  profile: any
  shipments: any[]
  addresses: any[]
}

export default function DashboardTabs({ profile, shipments, addresses }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("shipments")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="shipments" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">Shipments</span>
        </TabsTrigger>
        <TabsTrigger value="addresses" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="hidden sm:inline">Addresses</span>
        </TabsTrigger>
        <TabsTrigger value="create" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">New Shipment</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileTab profile={profile} />
      </TabsContent>

      <TabsContent value="shipments">
        <ShipmentsTab shipments={shipments} />
      </TabsContent>

      <TabsContent value="addresses">
        <AddressesTab addresses={addresses} />
      </TabsContent>

      <TabsContent value="create">
        <CreateShipmentTab addresses={addresses} />
      </TabsContent>
    </Tabs>
  )
}
