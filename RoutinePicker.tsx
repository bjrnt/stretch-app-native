import React from 'react'
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectItem,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectBackdrop,
  SelectContent,
  Box,
} from '@gluestack-ui/themed'
import { ChevronDownIcon } from 'lucide-react-native'

export default function RoutinePicker<T>({
  selectedValue,
  onValueChange,
  routines,
  labels,
}: {
  selectedValue: string
  onValueChange: (value: string) => void
  routines: string[]
  labels: string[]
}) {
  return (
    <Box paddingBottom="$2">
      <Select selectedValue={selectedValue} onValueChange={onValueChange}>
        <SelectTrigger variant="rounded" size="md">
          <SelectInput placeholder="Select routine" />
          <SelectIcon mr="$3" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {routines.map((routineName, idx) => (
              <SelectItem
                key={routineName}
                label={labels[idx]}
                value={routineName}
              />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
    </Box>
  )
}
