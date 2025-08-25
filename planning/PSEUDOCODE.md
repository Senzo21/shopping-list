
# Pseudocode (core flows)

## Register
onSubmit:
  if email unique (GET /users?email=x) then
    POST /users { ...fields, password: AES.encrypt(password) }
    redirect to /login
  else show error

## Login
onSubmit:
  user = GET /users?email=x
  if user && AES.decrypt(user.password) == inputPassword
    set redux auth.user and token
    redirect to /
  else show error

## Home
useEffect: if user -> fetch lists (GET /lists?ownerId=user.id)
Add list:
  POST /lists { ownerId, name, createdAt, items: [] }
Rename/Delete list:
  PATCH /lists/:id { name } / DELETE /lists/:id
Add/Edit/Delete item:
  PATCH /lists/:id with new items array

Search & Sort:
  state { q, sort, dir }
  useQuerySync(state, setState)
  render items filtered by q and sorted by sort/dir

Share
  GET /lists/:listId and render without auth
