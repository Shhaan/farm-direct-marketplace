import { Route, Routes } from "react-router-dom";
import { createContext } from "react";
// customer
import Login from "./Pages/Customer/Login/Login";
import Register from "./Pages/Customer/Register/Register";

import Market from "./Pages/Customer/Market/Market";
import Crop from "./Pages/Customer/Crop/Crop";

import Otp from "./Pages/Customer/Otp/Otp";
import Home from "./Pages/Customer/Home/Home";

import Userprofile from "./Pages/Customer/Profiles/Profile/Profile";
import UserprofileEdit from "./Pages/Customer/Profiles/ProfileEdit/ProfileEdit";
import UserWallet from "./Pages/Customer/Profiles/Wallet/Wallet";
import UserCart from "./Pages/Customer/Profiles/Cart/Cart";
import UserFollowing from "./Pages/Customer/Profiles/Following/Following";
import UserOrders from "./Pages/Customer/Profiles/Orders/Orders";
import UserShipping from "./Pages/Customer/Profiles/Shipping/Shipping";
import UserInbox from "./Pages/Customer/Profiles/Inbox/Inbox";
import Farmers from "./Pages/Customer/Farmers/Farmers";
import Aboutproduct from "./Pages/Customer/Aboutproduct/Aboutproduct";
import Farmerprofile from "./Pages/Customer/Farmerprofile/Farmerprofile";
import UserOrderdetails from "./Pages/Customer/Profiles/Orders/Orderdetails";
// famrmer
import FarmerRegister from "./Pages/Farmer/Register/Register";
import FarmerHome from "./Pages/Farmer/Home/Home";
import FarmerSale from "./Pages/Farmer/Sale/Sale";
import FarmerAddcrop from "./Pages/Farmer/Addcrop/Addcrop";
import FarmerEditcrop from "./Pages/Farmer/Editcrop/Editcrop";
import FarmerInbox from "./Pages/Farmer/Inbox/Inbox";
import FarmerFollower from "./Pages/Farmer/Follower/Follower";
import FarmerProfileEdit from "./Pages/Farmer/ProfilEdit/ProfilEdit";
import FarmerProfile from "./Pages/Farmer/Profile/Profile";
import FarmerOrders from "./Pages/Farmer/Orders/Orders";
import Ordersdetail from "./Pages/Farmer/Orders/Ordersdetail";
import RegTransaction from "./Pages/Farmer/RegTransaction/RegTransaction";

// admin
import Orders from "./Pages/Admin/Orders/Orders";
import OrderDetails from "./Pages/Admin/Orders/Orderdetail";

import Adminlogin from "./Pages/Admin/Login/Login";
import AdminDashboard from "./Pages/Admin/Dashboard/Dashboard";

import AdminCategory from "./Pages/Admin/Category/Category";
import AdminAddCategory from "./Pages/Admin/AddCategory/AddCategory";
import AdminEditCategory from "./Pages/Admin/EditCategory/EditCategory";
import Buy from "./Pages/Customer/Buy/Buy";
import AdminUsers from "./Pages/Admin/Users/Users";
import AdminFarmers from "./Pages/Admin/Farmers/Farmers";
import useTokenRefresh from "./Config/refreshcall";

import ContextBuy from "./Functions/FarmerInboxcontext";
import { Toaster } from "react-hot-toast";
function App() {
  useTokenRefresh();

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="*" element={<div>page not found</div>} />

        {/* customer */}

        <Route path="/login" element={<Login />} />
        <Route path="" element={<Home />} />
        <Route path="/register" element={<Register />}></Route>
        <Route path="/market" element={<Market />}></Route>
        <Route path="/crop/:slug" element={<Crop />}></Route>

        <Route
          path="/crop/buy/:slug"
          element={
            <ContextBuy>
              {" "}
              <Buy />{" "}
            </ContextBuy>
          }
        ></Route>

        <Route path="/register/otp-verification" element={<Otp />}></Route>
        <Route path="/profile" element={<Userprofile />}></Route>
        <Route path="/edit/profile" element={<UserprofileEdit />}></Route>

        <Route path="/inbox" element={<UserInbox />}></Route>
        <Route path="/cart" element={<UserCart />}></Route>
        <Route path="/shipping-address" element={<UserShipping />}></Route>
        <Route path="/following-farmer" element={<UserFollowing />}></Route>
        <Route path="/wallet" element={<UserWallet />}></Route>
        <Route path="/orders" element={<UserOrders />}></Route>
        <Route path="/orders/:id" element={<UserOrderdetails />}></Route>
        <Route path="/farmer" element={<Farmers />}></Route>
        <Route path="/aboutitem" element={<Aboutproduct />}></Route>
        <Route path="/farmer-profile/:slug" element={<Farmerprofile />}></Route>

        {/* farmer */}
        <Route path="/farmer">
          <Route path="register" element={<FarmerRegister />} />
          <Route path="register/transaction" element={<RegTransaction />} />
          <Route path="sale" element={<FarmerSale />} />
          <Route path="follower" element={<FarmerFollower />} />
          <Route path="edit/profile" element={<FarmerProfileEdit />} />
          <Route path="profile" element={<FarmerProfile />} />
          <Route path="inbox" element={<FarmerInbox />} />

          <Route path="sale/add/crop" element={<FarmerAddcrop />} />
          <Route path="sale/edit/crop/:id" element={<FarmerEditcrop />} />
          <Route path="orders" element={<FarmerOrders />} />
          <Route path="orders/:id" element={<Ordersdetail />} />
          <Route path="dashboard" element={<FarmerHome />} />
        </Route>

        {/* admin */}
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/orders/:id" element={<OrderDetails />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          {" "}
        </Route>
        <Route path="/admin/login" element={<Adminlogin />} />
        <Route path="/admin/category" element={<AdminCategory />}>
          <Route path="delete/:categoryId" element={<AdminCategory />} />
        </Route>
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/farmers" element={<AdminFarmers />} />
        <Route path="/admin/category/add" element={<AdminAddCategory />} />
        <Route
          path="/admin/category/edit/:categoryId"
          element={<AdminEditCategory />}
        />
      </Routes>
    </>
  );
}

export default App;
