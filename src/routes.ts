import {
  Album,
  Banknote,
  BookOpen,
  DollarSign,
  Filter,
  Home,
  Landmark,
  LineChart,
  LucideIcon,
  Receipt,
  Shield,
  User,
  Users,
} from 'lucide-react'

export type Route = {
  name: string
  path: string
  Icon: LucideIcon
  access: 'public' | 'private' | 'admin'
  description?: string
  disabled?: boolean
  hidden?: boolean
}

export type Routes = {
  public: Route[]
  private: Route[]
  admin: Route[]
}

export const routes: Route[] = [
  {
    name: 'Home',
    path: '/home',
    Icon: Home,
    access: 'public',
    hidden: true,
  },
  {
    name: 'Statistics',
    path: '/statistics',
    Icon: LineChart,
    access: 'public',
  },
  {
    name: 'Personal Finance',
    path: '/personal-finance',
    Icon: Receipt,
    access: 'public',
  },
  {
    name: 'Insurance Policy',
    path: '/insurance-policy',
    Icon: Shield,
    access: 'public',
  },
  {
    name: 'Debt',
    path: '/debt',
    Icon: Banknote,
    access: 'public',
  },
  {
    name: 'Banking',
    path: '/banking',
    Icon: Landmark,
    access: 'public',
  },
  {
    name: 'Creative Cash Flow',
    path: '/creative-cash-flow',
    Icon: DollarSign,
    access: 'public',
  },
  {
    name: 'Creative Cash Flow Records',
    path: '/creative-cash-flow-records',
    Icon: Album,
    access: 'public',
  },
  {
    name: 'Glossary',
    path: '/glossary',
    Icon: BookOpen,
    access: 'public',
  },
  {
    name: 'Transaction Filtering',
    path: '/transaction-filtering',
    Icon: Filter,
    access: 'admin',
  },
  {
    name: 'Manage Users',
    path: '/manage-users',
    Icon: Users,
    access: 'admin',
  },
  {
    name: 'Profile',
    path: '/profile',
    Icon: User,
    access: 'private',
  },
]
