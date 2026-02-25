import { ref } from 'vue'
import { supabase } from '../utils/supabase'

export function useAttendance() {
  const loading = ref(false)
  const error = ref(null)

  const fetchPresentEmployees = async (groupIDs) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('hrapp_employees')
        .select('*')
        .in('group_id', groupIDs)
        // Add specific filtering for 'present' logic here
      
      if (sbError) throw sbError
      return data
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchCalendar = async (groupIDs) => {
    loading.value = true
    error.value = null
    try {
      // Fetch Leaves
      const { data: leaves, error: leavesError } = await supabase
        .from('leaves')
        .select('*')
        .in('group_id', groupIDs)

      if (leavesError) throw leavesError

      // Fetch Special Dates
      const { data: specialDates, error: specialError } = await supabase
        .from('special_dates')
        .select('*')
        .in('group_id', groupIDs)

      if (specialError) throw specialError

      return { leaves, special: specialDates }
    } catch (err) {
      error.value = err.message
      return { leaves: [], special: [] }
    } finally {
      loading.value = false
    }
  }

  const fetchLeavesByEmail = async (email) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('leaves')
        .select('*')
        .eq('employee_company_email', email)
      
      if (sbError) throw sbError
      return data
    } catch (err) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchPresentEmployees,
    fetchCalendar,
    fetchLeavesByEmail
  }
}
