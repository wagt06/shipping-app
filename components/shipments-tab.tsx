"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Search, MapPin, Calendar, User } from "lucide-react"
import { format } from "date-fns"

interface ShipmentsTabProps {
  shipments: any[]
}

export default function ShipmentsTab({ shipments }: ShipmentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredShipments = shipments.filter(
    (shipment) =>
      shipment.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.status?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in transit":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Shipments</CardTitle>
        <CardDescription>Track and manage your shipments</CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by tracking number, recipient or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredShipments.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No shipments found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {shipments.length === 0
                ? "You haven't created any shipments yet."
                : "No shipments match your search criteria."}
            </p>
            {shipments.length === 0 && (
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => document.querySelector('[data-value="create"]')?.click()}
              >
                Create your first shipment
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredShipments.map((shipment) => (
              <div key={shipment.id} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="font-medium">{shipment.tracking_number}</span>
                  </div>
                  <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{shipment.recipient_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(shipment.created_at), "PPP")}</span>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{shipment.destination_address}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
