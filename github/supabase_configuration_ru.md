# Конфигурация supabase
Сначала нужно создать проект https://app.supabase.com/projects

Войти в проект
## 1. Подключение к supabase
нужно скопировать URL и AnonKey и вставить в supabase.js
![image](https://user-images.githubusercontent.com/37046811/204094433-2d7d96bf-1172-4100-b606-1af2edd64e90.png)
![image](https://user-images.githubusercontent.com/37046811/204094326-23368c1f-293e-436c-a801-0c9f315af225.png)
## 2. Настройка авторизации через Google
Подробно https://supabase.com/docs/guides/auth/auth-google
1. Настроить эту ересть https://console.cloud.google.com/apis/credentials/
![image](https://user-images.githubusercontent.com/37046811/204094653-af8c3e00-dc44-4776-9dd5-1d77187ca5ae.png)
2. Добавить новый Oauth client id ![image](https://user-images.githubusercontent.com/37046811/204094706-9b5a7681-af68-4503-8881-393d1d252a2f.png)
3. Включить в provider google и вставить нужные данные ![image](https://user-images.githubusercontent.com/37046811/204094804-3cea54ff-8e71-44c3-a7c3-8bfed0519f1c.png)
4. Вставить Redirect URL из предыдущего шага в это поле
![image](https://user-images.githubusercontent.com/37046811/204094874-b5443654-2379-49ca-93fa-71689e6f4f82.png)
5. Добавить нужные redirect URLs, куда нужно редиректить при авторизации
![image](https://user-images.githubusercontent.com/37046811/204094922-d730fc3e-61a3-45b7-8d6a-39b53117195d.png)
6. Указать куда редиректить при авторизации
![image](https://user-images.githubusercontent.com/37046811/204095004-95f3e071-6ddc-4819-b579-3e9389650806.png)
## 3. Создание нужных таблиц
В данном проекте используются 2 таблицы message и user_info.
Добавление таблиц:
![image](https://user-images.githubusercontent.com/37046811/204095153-b59077f2-6cff-4c5f-8f7f-f99c2f2b9f5c.png)
Обязательно нужно ставить галочки 
* Enable Row Level Security (RLS) для того что поставить права доступа к таблице
* Enable Realtime для того чтобы присылались события измения бд на клиент
### Для данного проекта указать для message и user_info такую структуру
![image](https://user-images.githubusercontent.com/37046811/204095258-a3ec5962-6a40-4ba5-892f-782330530ac5.png)
![image](https://user-images.githubusercontent.com/37046811/204095282-80866476-2107-4361-808b-35c0f0db07f3.png)
## 4. Добавление policies на таблицы
! Если не указать policies то доступ к таблицам будет заблакировать из вне
![image](https://user-images.githubusercontent.com/37046811/204095394-4b6dea72-d2b6-469f-b824-b72804fe2bb0.png)
Пример для Select
![image](https://user-images.githubusercontent.com/37046811/204095450-504a90dc-cb52-4609-a108-5b4cbc914d0b.png)
таким же образом выставляем для нужных таблиц 

Я выставил для message
SELECT: 
* USING expression = true
INSERT
* role = authenticated
* USING expression = true
DELETE: 
* USING expression = (uid() = user_id)
UPDATE:
* USING expression = (uid() = user_id)
* WITH CHECK expression = (uid() = user_id)
Для user_info аналогично
## Дополнительно
* Как пользоваться supabase-js
![image](https://user-images.githubusercontent.com/37046811/204097223-2132a0b5-111e-43dd-8313-2e98e3009c6f.png)
* каналы для передачи данных между клиентами https://supabase.com/docs/guides/realtime/quickstart
* получение обновления таблиц на клиенте https://supabase.com/docs/guides/realtime/postgres-cdc
* supabase-js получения аутифецированого пользователя и тд https://supabase.com/docs/reference/javascript/auth-getuser
* supabase-js манипуляция с database https://supabase.com/docs/reference/javascript/select
* supabase-js api для работы с realtime каналами https://supabase.com/docs/reference/javascript/subscribe




