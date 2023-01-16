import CalendarStep from './CalendarStep'
import ConfirmStep from './ConfirmStep/index'
import { useState } from 'react'

export default function ScheduleForm() {
  const [selectScheduleDateTime, setSelectScheduleDateTime] =
    useState<Date | null>(null)

  function handleClearScheduleDateTime() {
    setSelectScheduleDateTime(null)
  }

  if (selectScheduleDateTime) {
    return (
      <ConfirmStep
        scheduleDateTime={selectScheduleDateTime}
        onClearScheduleDateTime={handleClearScheduleDateTime}
      />
    )
  }

  return <CalendarStep onSelectScheduleDateTime={setSelectScheduleDateTime} />
}
