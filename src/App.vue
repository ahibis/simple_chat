<template>
  <v-app>
    <v-main>
      <div v-if="!session" class="center">
        <v-Btn color="secondary" @click="auth">Auth by Google</v-Btn>
      </div>
      <div v-else>
        <v-card class="mx-auto" max-width="500">
          <v-toolbar color="deep-purple accent-4" dark>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-app-bar-nav-icon v-bind="props"></v-app-bar-nav-icon>
              </template>
              <v-list density="compact">

                <v-list-item @click="logout">
                  выйти
                  <template v-slot:prepend>
                    <v-icon icon="mdi-door"></v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-toolbar-title>My chat</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-toolbar>
          <div style="height:80vh; overflow-y: auto;" ref="box">
            <v-list subheader>
              <v-list-item v-for="{ message, user_id } in messages" :key="message">
                <template v-slot:prepend>
                  <v-avatar size="80">
                    <img :alt="`${message} avatar`" :src="users[user_id].img">
                  </v-avatar>
                </template>

                <v-list-item-title v-text="users[user_id].name"></v-list-item-title>

                <v-list-item-content>
                  <v-list-item-title v-text="message"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          <div>
            <v-text-field v-model="text" @keydown.enter="send">

            </v-text-field>
          </div>
        </v-card>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useScroll } from "@vueuse/core"
import { supabase } from "./assets/supabase";
import User from "./assets/user";
import Message from "./assets/message";
import { Session } from "@supabase/supabase-js";

const session = ref<Session | null>();
const messages = ref<Message[]>([]);
const users = User.users
const text = ref("")
const box = ref()
const { x, y, isScrolling, arrivedState } = useScroll(box)

onMounted(async () => {
  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
  const { data } = await supabase.auth.getSession()
  session.value = data.session;
  if (!session.value) return;
  await User.register()
  const messages_data = await Message.getAll()
  const user_ids = [...new Set(messages_data.map(({user_id})=>user_id))] 
  await Promise.all(user_ids.map(user_id => User.getById(user_id)))
  messages.value = messages_data
  setTimeout(() => y.value = 100000, 100)
  Message.subscribe(async message => {
    await User.getById(message.user_id)
    messages.value.push(message)
    if (arrivedState.bottom) setTimeout(() => y.value += 100, 100)
  })
});

async function auth() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
}
async function logout() {
  const { error } = await supabase.auth.signOut()
  if(error) return alert(error)

}
async function send() {
  if (!text.value) return;
  const id = session.value?.user.id
  if (!id) return
  await Message.send(text.value, id)
  text.value = ""
}
</script>
