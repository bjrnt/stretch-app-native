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
  labels,
  onValueChange,
  routines,
  selectedValue,
}: {
  labels: string[]
  onValueChange: (value: string) => void
  routines: string[]
  selectedValue: string
}) {
  return (
    <Box paddingBottom="$2">
      <Select onValueChange={onValueChange} selectedValue={selectedValue}>
        <SelectTrigger size="md" variant="rounded">
          <SelectInput placeholder="Select routine" />
          <SelectIcon as={ChevronDownIcon} mr="$3" />
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
