"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Plus, Edit, Trash2 } from "lucide-react"

interface AddressesTabProps {
  addresses: any[]
}

export default function AddressesTab({ addresses: initialAddresses }: AddressesTabProps) {
  const supabase = createClient()
  const { toast } = useToast()
  const [addresses, setAddresses] = useState(initialAddresses)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddAddress = () => {
    setEditingAddress(null)
    setFormData({
      name: "",
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditAddress = (address: any) => {
    setEditingAddress(address)
    setFormData({
      name: address.name || "",
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "",
    })
    setIsDialogOpen(true)
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.from("addresses").delete().eq("id", id)

      if (error) {
        throw error
      }

      setAddresses(addresses.filter((address) => address.id !== id))

      toast({
        title: "Address deleted",
        description: "The address has been deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete address",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (editingAddress) {
        // Update existing address
        const { error, data } = await supabase
          .from("addresses")
          .update({
            name: formData.name,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
          })
          .eq("id", editingAddress.id)
          .select()

        if (error) {
          throw error
        }

        setAddresses(
          addresses.map((address) => (address.id === editingAddress.id ? { ...address, ...data[0] } : address)),
        )

        toast({
          title: "Address updated",
          description: "The address has been updated successfully",
        })
      } else {
        // Create new address
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const { error, data } = await supabase
          .from("addresses")
          .insert([
            {
              user_id: user?.id,
              name: formData.name,
              street: formData.street,
              city: formData.city,
              state: formData.state,
              postal_code: formData.postal_code,
              country: formData.country,
            },
          ])
          .select()

        if (error) {
          throw error
        }

        setAddresses([...addresses, data[0]])

        toast({
          title: "Address added",
          description: "The address has been added successfully",
        })
      }

      setIsDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save address",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Addresses</CardTitle>
          <CardDescription>Manage your saved addresses</CardDescription>
        </div>
        <Button onClick={handleAddAddress} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No addresses found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Add your first address to get started</p>
            <Button className="mt-4" variant="outline" onClick={handleAddAddress}>
              Add an address
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{address.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {address.street}, {address.city}, {address.state} {address.postal_code}, {address.country}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditAddress(address)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            <DialogDescription>
              {editingAddress ? "Update your address information below" : "Enter the address details below"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Address Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Home, Work, etc."
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                name="street"
                placeholder="123 Main St"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  placeholder="Postal Code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Address"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
