import { supabase } from "./supabase";
export default class Message{
  id = 0
  created_at = ""
  message = ""
  user_id = ""
  attachments = ""
  static async getAll(){
    const { data , error } = await supabase
      .from('message')
      .select("*") 
    if(!data) return []
    const messages:Message[]= data.map(
      message=>Object.assign(new Message(),message))
    return messages
  }
  static async getUsersIds(){
    const { data , error } = await supabase
      .from('message')
      .select("user_id") 
    if(!data) return []
    const messages:string[]= data.map(({user_id})=>user_id)
    return messages
  }
  static async send(message:string, user_id:string){
    const { data, error } = await supabase
      .from('message')
      .insert([
        {user_id, message, attachments:[]}
      ])
  }
  static subscribe(func: (message:Message)=>any){
    supabase
      .channel('table-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table:"message" }, async payload => {
        func(Object.assign(new Message(),payload.new))
      })
      .subscribe()
  }
}