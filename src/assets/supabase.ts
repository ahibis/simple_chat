import { createClient } from '@supabase/supabase-js'



const supabaseUrl =  "https://cwvmdyprnekkkdvkyslv.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dm1keXBybmVra2tkdmt5c2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg4MTM2MjQsImV4cCI6MTk4NDM4OTYyNH0.Com2H55_HjPeTo2OkifDTmWcwn4Wn4DbenQPwaj1LOE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey,{
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})
const channel = supabase.channel('room1')