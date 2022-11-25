import { supabase } from "./supabase";
import { reactive } from "vue";
export default class User{
  id:number = 0
  created_at:number = 0
  name:string = ""
  user_id:string = ""
  img:string = ""
  static users:{[key:string]:User} = reactive({})
  static async getById(uuid:string){
    if(User.users[uuid]){
      return User.users[uuid]
    }
    const { data, error } = await supabase
      .from('user_info')
      .select("*")
      .eq("user_id",uuid)
    if(!data) return null
    const user_info:User[]= data.map(
        user=>Object.assign(new User(),user))
    if(!user_info.length){
      return null
    }
    User.users[uuid] = user_info[0]
    return user_info[0]
  }
  static async register(){
    const {data, error} = await supabase.auth.getUser()
    if(error){
      return false
    }
    const id = data.user.id
    if(!id) return false
    const candidate = await User.getById(id)
    if(candidate) return candidate
    const { data:d1, error:e1 } = await supabase
      .from('user_info')
      .insert([
        { 
          name: data.user.user_metadata.full_name,
          img: data.user.user_metadata.avatar_url,
          user_id: id
        }
      ])
      
    return true
  }
}