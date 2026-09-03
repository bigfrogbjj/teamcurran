import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const publicMemberRoutes = ["/members/login", "/members/reset", "/members/set-password"];
  const isMembersRoute = pathname.startsWith("/members");
  const isPublicMemberRoute = publicMemberRoutes.some((r) => pathname.startsWith(r));

  if (isMembersRoute && !isPublicMemberRoute && !user) {
    return NextResponse.redirect(new URL("/members/login", request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/members/login", request.url));
    }
    const { data: member } = await supabase
      .from("members")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    if (!member?.is_admin) {
      return NextResponse.redirect(new URL("/members", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/members/:path*", "/admin/:path*"],
};
