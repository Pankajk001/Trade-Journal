import { db, currentUser, unwrap } from "../lib/supabase";
export const userView = (user) =>
  user
    ? {
        ...user,
        _id: user.id,
        name: user.user_metadata?.name || user.email?.split("@")[0],
      }
    : null;
export default {
  async getMe() {
    return userView(await currentUser());
  },
  async login(email, password) {
    return userView(
      unwrap(await db().auth.signInWithPassword({ email, password })).user,
    );
  },
  async register(name, email, password) {
    const data = unwrap(
      await db().auth.signUp({ email, password, options: { data: { name } } }),
    );
    return data.session ? userView(data.user) : null;
  },
  async logout() {
    unwrap(await db().auth.signOut());
  },
  async updateProfile({ name, email, password }) {
    return userView(
      unwrap(
        await db().auth.updateUser({
          email,
          ...(password ? { password } : {}),
          data: { name },
        }),
      ).user,
    );
  },
  async resetPassword(email) {
    unwrap(
      await db().auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      }),
    );
  },
};
