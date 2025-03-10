import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ChevronUp,
  Heart,
  Home,
  LogIn,
  ShoppingBag,
  ShoppingCart,
  User2,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/Redux/api/usersApiSlice";
import { logout } from "@/Redux/features/auth/authSlice";

const navItems = [
  { name: "Home", url: "", icon: Home },
  { name: "Shop", url: "shop", icon: ShoppingBag },
  { name: "Cart", url: "cart", icon: ShoppingCart },
  { name: "Favourites", url: "favourites", icon: Heart },
];

export function AppSidebar() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="mb-5">
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((navItem) => (
                <SidebarMenuItem key={navItem.name} className="h-10 mb-2">
                  <SidebarMenuButton
                    asChild
                    className={`font-semibold h-10 ${
                      location.pathname === `/${navItem.url}`
                        ? "bg-gray-100"
                        : "text-gray-700"
                    }`}
                  >
                    <Link to={`/${navItem.url}`}>
                      <navItem.icon />
                      <span>{navItem.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {userInfo && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="mb-5 font-semibold">
                    <User2 /> {userInfo.username}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  {userInfo.isAdmin && (
                    <>
                      <DropdownMenuItem>
                        <Link to="/admin/dashboard">
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link to="/admin/allproductlist">
                          <span>Products</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/admin/categorylist">
                          <span>Categories</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/admin/orderlist">
                          <span>Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="/admin/userlist">
                          <span>Users</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile">
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!userInfo && (
              <>
                <Link to="/register">
                  <SidebarMenuButton className="mb-5 font-semibold truncate overflow-hidden whitespace-nowrap">
                    <UserPlus /> Signup
                  </SidebarMenuButton>
                </Link>
                <Link to="/login">
                  <SidebarMenuButton className="mb-5 font-semibold truncate overflow-hidden whitespace-nowrap">
                    <LogIn /> Login
                  </SidebarMenuButton>
                </Link>
              </>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
