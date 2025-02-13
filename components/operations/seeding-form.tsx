"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function SeedingForm({ onSubmit, seededCrops, onTransplant }) {
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    subvariety: "",
    quantity: "",
    plantingDate: "",
  })
  const [transplantData, setTransplantData] = useState({
    field: "",
    expectedHarvest: "",
  })
  const [selectedCropId, setSelectedCropId] = useState(null)
  const [options, setOptions] = useState({
    name: [],
    variety: [],
    subvariety: [],
    quantity: [],
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleTransplantChange = (e) => {
    setTransplantData({ ...transplantData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      status: "Seeded",
    })
    setFormData({
      name: "",
      variety: "",
      subvariety: "",
      quantity: "",
      plantingDate: "",
    })
  }

  const handleTransplant = () => {
    onTransplant(selectedCropId, "Transplanted", transplantData.field, transplantData.expectedHarvest)
    setSelectedCropId(null)
    setTransplantData({ field: "", expectedHarvest: "" })
  }

  const addOption = (field, value) => {
    if (value && !options[field].includes(value)) {
      setOptions({ ...options, [field]: [...options[field], value] })
    }
  }

  return (
    <div className="space-y-8">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-primary">Seeding</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {Object.keys(formData).map(
              (field) =>
                field !== "plantingDate" && (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="capitalize">
                      {field}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between">
                          {formData[field] || `Select ${field}`}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder={`Search ${field}...`} />
                          <CommandList>
                            <CommandEmpty>No {field} found.</CommandEmpty>
                            <CommandGroup>
                              {(options[field] || []).map((item) => (
                                <CommandItem
                                  key={item}
                                  onSelect={() => {
                                    setFormData({ ...formData, [field]: item })
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData[field] === item ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {item}
                                </CommandItem>
                              ))}
                              <CommandItem
                                onSelect={() => {
                                  const newValue = prompt(`Enter new ${field}`)
                                  if (newValue) {
                                    addOption(field, newValue)
                                    setFormData({ ...formData, [field]: newValue })
                                  }
                                }}
                              >
                                <Check className="mr-2 h-4 w-4 opacity-0" />+ Add new {field}
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                ),
            )}
            <div className="space-y-2">
              <Label htmlFor="plantingDate">Date of Seeding</Label>
              <Input
                id="plantingDate"
                name="plantingDate"
                type="date"
                value={formData.plantingDate}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-primary">Seeded Crops</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead>Subvariety</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Planting Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...seededCrops].reverse().map((crop) => (
                <TableRow key={crop.id}>
                  <TableCell>{crop.name}</TableCell>
                  <TableCell>{crop.variety}</TableCell>
                  <TableCell>{crop.subvariety}</TableCell>
                  <TableCell>{crop.quantity}</TableCell>
                  <TableCell>{crop.plantingDate}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setSelectedCropId(crop.id)}
                          className="bg-accent text-accent-foreground hover:bg-accent/90"
                        >
                          Transplant
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Transplant Crop</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="field">Field</Label>
                            <Input
                              id="field"
                              name="field"
                              value={transplantData.field}
                              onChange={handleTransplantChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expectedHarvest">Expected Harvest Date</Label>
                            <Input
                              id="expectedHarvest"
                              name="expectedHarvest"
                              type="date"
                              value={transplantData.expectedHarvest}
                              onChange={handleTransplantChange}
                              required
                            />
                          </div>
                          <Button
                            onClick={handleTransplant}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Confirm Transplant
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

