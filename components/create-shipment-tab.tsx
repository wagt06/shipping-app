"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Package, User, Phone, Mail } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface CreateShipmentTabProps {
  addresses: any[]
}

export default function CreateShipmentTab({ addresses }: CreateShipmentTabProps) {
  const supabase = createClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    origin_address_id: "",
    destination_address: "",
    recipient_name: "",
    recipient_phone: "",
    recipient_email: "",
    package_weight: "",
    package_dimensions: "",
    package_description: "",
    pickup_date: "",
  })

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }

    getUserId()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!userId) {
        throw new Error("User not authenticated")
      }

      // Generate a tracking number
      const trackingNumber = `SHP${uuidv4().substring(0, 8).toUpperCase()}`

      // Create the shipment
      const { error } = await supabase.from("shipments").insert([
        {
          user_id: userId,
          tracking_number: trackingNumber,
          origin_address_id: formData.origin_address_id,
          destination_address: formData.destination_address,
          recipient_name: formData.recipient_name,
          recipient_phone: formData.recipient_phone,
          recipient_email: formData.recipient_email,
          package_weight: formData.package_weight,
          package_dimensions: formData.package_dimensions,
          package_description: formData.package_description,
          pickup_date: formData.pickup_date,
          status: "Pending",
        },
      ])

      if (error) {
        throw error
      }

      toast({
        title: "Shipment created",
        description: `Your shipment has been created with tracking number: ${trackingNumber}`,
      })

      // Reset form
      setFormData({
        origin_address_id: "",
        destination_address: "",
        recipient_name: "",
        recipient_phone: "",
        recipient_email: "",
        package_weight: "",
        package_dimensions: "",
        package_description: "",
        pickup_date: "",
      })

      // Switch to shipments tab
      document.querySelector('[data-value="shipments"]')?.click()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create shipment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Shipment</CardTitle>
        <CardDescription>Fill in the details to create a new shipment</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Origin Information</h3>

            <div className="space-y-2">
              <Label htmlFor="origin_address_id">Select Origin Address</Label>
              <Select
                value={formData.origin_address_id}
                onValueChange={(value) => handleSelectChange("origin_address_id", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an address" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.length === 0 ? (
                    <SelectItem value="no-address" disabled>
                      No addresses available
                    </SelectItem>
                  ) : (
                    addresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        {address.name} - {address.street}, {address.city}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {addresses.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">Please add an address in the Addresses tab first</p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Destination Information</h3>

            <div className="space-y-2">
              <Label htmlFor="destination_address">Destination Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="destination_address"
                  name="destination_address"
                  placeholder="Enter full address"
                  value={formData.destination_address}
                  onChange={handleChange}
                  className="pl-10 min-h-[80px]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipient_name">Recipient Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="recipient_name"
                    name="recipient_name"
                    placeholder="Full name"
                    value={formData.recipient_name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient_phone">Recipient Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="recipient_phone"
                    name="recipient_phone"
                    placeholder="Phone number"
                    value={formData.recipient_phone}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient_email">Recipient Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="recipient_email"
                  name="recipient_email"
                  type="email"
                  placeholder="Email address"
                  value={formData.recipient_email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Package Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="package_weight">Package Weight (kg)</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="package_weight"
                    name="package_weight"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Weight in kg"
                    value={formData.package_weight}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="package_dimensions">Package Dimensions (cm)</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="package_dimensions"
                    name="package_dimensions"
                    placeholder="L x W x H"
                    value={formData.package_dimensions}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="package_description">Package Description</Label>
              <Textarea
                id="package_description"
                name="package_description"
                placeholder="Describe the contents of your package"
                value={formData.package_description}
                onChange={handleChange}
                className="min-h-[80px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup_date">Pickup Date</Label>
              <Input
                id="pickup_date"
                name="pickup_date"
                type="date"
                value={formData.pickup_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || addresses.length === 0} className="w-full">
            {isLoading ? "Creating Shipment..." : "Create Shipment"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
