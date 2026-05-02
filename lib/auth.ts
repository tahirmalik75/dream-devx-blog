// lib/auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createAdminClient } from './supabase';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: { 
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).toLowerCase();
        console.log('--- Attempting login for:', email);
        
        const supabase = createAdminClient();

        try {
          // 1. Authenticate with Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: credentials.password as string,
          });

          if (error || !data.user) {
            console.log('--- Auth Error:', error?.message);
            return null;
          }

          console.log('--- Auth Success. User ID:', data.user.id);

          // 2. Check Admin role by EMAIL (more reliable than ID sometimes)
          const { data: profile, error: profileError } = await supabase
            .from('admin_users')
            .select('role')
            .eq('email', email)
            .single();

          if (profileError || !profile || profile.role !== 'admin') {
            console.log('--- Role Check Failed for email:', email);
            
            // EMERGENCY FALLBACK: If it's the main admin email, let them in anyway
            if (email === 'connect.dreamdev@gmail.com') {
              console.log('--- Emergency Fallback: Main Admin detected. Allowing login.');
              return {
                id: data.user.id,
                email: data.user.email,
                role: 'admin',
              };
            }
            return null;
          }

          console.log('--- Admin Verified!');
          return {
            id: data.user.id,
            email: data.user.email,
            role: 'admin',
          };
        } catch (err) {
          console.error('--- Unexpected Error:', err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
