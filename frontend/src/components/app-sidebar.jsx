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
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronUp,
  Heart,
  Home,
  LogIn,
  ShoppingBag,
  ShoppingCart,
  User2,
  UserPlus,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '@/Redux/api/usersApiSlice';
import { logout } from '@/Redux/features/auth/authSlice';
import { Separator } from '@/components/ui/separator';

const navItems = [
  {
    name: 'Home',
    url: '',
    icon: Home,
  },
  {
    name: 'Shop',
    url: 'shop',
    icon: ShoppingBag,
  },
  {
    name: 'Cart',
    url: 'cart',
    icon: ShoppingCart,
  },
  {
    name: 'Favourites',
    url: 'favourites',
    icon: Heart,
  },
];

export function AppSidebar() {
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((navItem) => (
                <SidebarMenuItem
                  key={navItem.name}
                  className="w-full h-12 font-semibold"
                >
                  <SidebarMenuButton asChild>
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
                  <Separator />
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
                  <SidebarMenuButton className="mb-5 font-semibold">
                    <UserPlus /> Sign Up
                  </SidebarMenuButton>
                </Link>
                <Link to="/login">
                  <SidebarMenuButton className="mb-5 font-semibold">
                    <LogIn /> Sign In
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
