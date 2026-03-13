import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Navbar/Navbar.jsx";
import Footer from "./Footer/Footer.jsx";
import Tvl from "./Tvl/Tvl.jsx";
import Hit from "./Tvl/Hit.jsx";
import HomePage from "./HomePage/HomePage.jsx";
import Login from "./Login/Login.jsx";
import SignUp from "./Login/SignUp.jsx";
import Book from "./Book/Book.jsx";
import Play from "./Play/Play.jsx";
import Train from "./Train/Train.jsx";
import Profile from "./Profile/Profile.jsx";
import MyProfile from "./Profile/MyProfile.jsx";
import ProfileHistory from "./Profile/History.jsx";
import Events from "./Events/Events.jsx";
import ShopSports from "./ShopSports/ShopSports.jsx";
import { Tournments } from "./Tournments/Tournments.jsx";
import About from "./About/About.jsx";
import Contact from "./Contact/Contact.jsx";
import PatnerSection from "./PatnerSection/PatnerSection.jsx";
import EditProfile from "./Profile/EditProfile.jsx";
import Settings from "./Settings/Settings.jsx";
import ChangePassword from "./Settings/ChangePassword.jsx";
import Terms from "./Settings/Terms.jsx";
import Privacy from "./Settings/Privacy.jsx";
import PartnerForm from "./PatnerSection/PartnerForm.jsx";
import ClubPolicy from "./ClubPolicy/ClubPolicy.jsx";


import Dashboard from "./Admin/Dashboard.jsx";
import AdminSettings from "./Admin/AdminSettings.jsx";
import Bookingmanagement from "./Admin/BookingManagement1.jsx";
import Chart from "./Admin/Chart.jsx";
import PaymentsReport from "./Admin/PaymentsReport.jsx";
import Sidebar from "./Admin/Sidebar.jsx";
import TurfManagement from "./Admin/TurfManagement.jsx";
import UserManagement from "./Admin/UserManagement.jsx";
import Vendor from "./Admin/Vender.jsx";
import AdminLogin from "./Admin/AdminLogin/AdminLogin.jsx";
import AdminSignup from "./Admin/AdminLogin/AdminSignup.jsx";
import AddVendor from "./Admin/AddVendor/AddVendor.jsx";
import AdminSideBar from "./Admin/AdminSideBar/AdminSideBar.jsx";
import AdminLayout from "./Admin/AdminLayout.jsx";
import AddTurf from "./Vendor/AddTurf.jsx";
import VendorRequest from "./Admin/VendorRequest/VendorRequest.jsx";
import VendorList from "./Admin/VendorList/VendorList.jsx";
import EditVendor from "./Admin/EditVendor/EditVendor.jsx";
import TurfList from "./Admin/TurfList/TurfList.jsx";

import VendorLogin from "./Vendor/VendorLogin/VendorLogin.jsx";
import VendorSignup from "./Vendor/VendorLogin/VendorSignup.jsx";
import Addturf from "./Vendor/AddTurf.jsx";
import Discount from "./Vendor/DiscountPage.jsx";
import VendorBookingManagement from "./Vendor/BookingManagement.jsx";
import VendorDashboard from "./Vendor/Dashboard.jsx";
import Vendorlogout from "./Vendor/Logout.jsx";
import Scheduletime from "./Vendor/ScheduleTime.jsx";
import VendorLayout from "./Vendor/layouts/VendorLayout.jsx";

import Galarypage from "./Book/Galarypage.jsx";
import BookingGround from "./Book/BookingGround.jsx";
import Payment from "./Book/PaymentPage";
import Bookhome from "./Book/Bookhome.jsx";
import Summary from "./Book/Summary.jsx";
import Mybooking from "./Book/MyBooking.jsx";
import Newonadugalam from "./Components/Newonadugalam/Newonadugalam.jsx";
import Tennis from "./Book/Tennis.jsx";
import AllCategories from "./AllCategories/AllCategories.jsx";
import Myfavourite from "./Profile/Myfavourite.jsx";
import Myreviews from "./Profile/Myreviews.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import Bottomnavbar from "./Bottomnavbar/Bottomnavbar.jsx";
import Location from "./Location/Location.jsx";
import ForgotPassword from "./Login/ForgotPassword.jsx";
import Cartpage from "./Book/Cartpage.jsx";

/* ---------------- NAVBAR WRAPPER ---------------- */
const NavbarWrapper = () => {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/Dashboard",
    "/AdminSettings",
    "/BookingManagement",
    "/Chart",
    "/PaymentsReport",
    "/TurfManagement",
    "/AddVendor",
    "/UserManagement",
    "/Vendor",
    "/AdminLogout",
    "/AddTurf",
    "/vendorRequest",
    "/VendorList",
    "/EditVendor",
    "/TurfList",
    "/VendorDashboard",
    "/addturf",
    "/discount",
    "/VendorBookingManagement",
    "/VendorLogout",
    "/Scheduletime",
    "/clubpolicy"
  ];

  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  return <Navbar />;
};

/* ---------------- FOOTER WRAPPER ---------------- */
const FooterWrapper = () => {
  const location = useLocation();

  const hideFooterRoutes = [
    "/cart",
    "/payment",
    "/location",

    "/Dashboard",
    "/AdminSettings",
    "/BookingManagement",
    "/Chart",
    "/PaymentsReport",
    "/TurfManagement",
    "/AddVendor",
    "/UserManagement",
    "/Vendor",
    "/AdminLogout",
    "/AddTurf",
    "/vendorRequest",
    "/VendorList",
    "/EditVendor",
    "/TurfList",
    "/VendorDashboard",
    "/addturf",
    "/discount",
    "/VendorBookingManagement",
    "/VendorLogout",
    "/Scheduletime",
    "/clubpolicy",
    "/mybooking",
  ];

  if (hideFooterRoutes.includes(location.pathname)) {
    return null;
  }

  return <Footer />;
};

/* ---------------- BOTTOM NAVBAR WRAPPER (Mobile Only) ---------------- */
const BottomNavbarWrapper = () => {
  const location = useLocation();

  const hideBottomNavbarRoutes = [
    "/Dashboard",
    "/AdminSettings",
    "/BookingManagement",
    "/Chart",
    "/PaymentsReport",
    "/TurfManagement",
    "/AddVendor",
    "/UserManagement",
    "/Vendor",
    "/AdminLogout",
    "/AddTurf",
    "/vendorRequest",
    "/VendorList",
    "/EditVendor",
    "/TurfList",
    "/VendorDashboard",
    "/addturf",
    "/discount",
    "/VendorBookingManagement",
    "/VendorLogout",
    "/Scheduletime",
    "/clubpolicy",
    "/payment",
    "/location",
    "/login",
    "/signup",
    "/VendorLogin",
    "/VendorSignup",
    "/AdminLogin",
    "/AdminSignup"
  ];

  if (hideBottomNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  return <Bottomnavbar />;
};
/* ---------------- ROUTE TRANSITION WRAPPER ---------------- */
const RouteTransition = ({ children }) => {
  const location = useLocation();
  return (
    <div className="route-transition" key={location.pathname}>
      {children}
    </div>
  );
};

/* ---------------- MAIN APP ---------------- */
const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <NavbarWrapper />

      <RouteTransition>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/VendorLogin" element={<VendorLogin />} />
          <Route path="/VendorSignup" element={<VendorSignup />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/AdminSignup" element={<AdminSignup />} />

          {/* USER */}
          <Route path="/book" element={<Book />} />
          <Route path="/play" element={<Play />} />
          <Route path="/train" element={<Train />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/MyProfile" element={<MyProfile />} />
          <Route path="/profilehistory" element={<ProfileHistory />} />
          <Route path="/hit" element={<Hit />} />
          <Route path="/tvl" element={<Tvl />} />
          <Route path="/events" element={<Events />} />
          <Route path="/shop" element={<ShopSports />} />
          <Route path="/tournaments" element={<Tournments />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partner" element={<PatnerSection />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/Privacy" element={<Privacy />} />
          <Route path="/ClubPolicy" element={<ClubPolicy />} />

          {/* ADMIN */}
          <Route element={<AdminLayout />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/AdminSettings" element={<AdminSettings />} />
            <Route path="/BookingManagement" element={<Bookingmanagement />} />
            <Route path="/Chart" element={<Chart />} />
            <Route path="/PaymentsReport" element={<PaymentsReport />} />
            <Route path="/TurfManagement" element={<TurfManagement />} />
            <Route path="/AddVendor" element={<AddVendor />} />
            <Route path="/UserManagement" element={<UserManagement />} />
            <Route path="/Vendor" element={<Vendor />} />
            <Route path="/AdminLogout" element={<AdminLogin />} />
            <Route path="/AddTurf" element={<AddTurf />} />
            <Route path="/VendorRequest" element={<VendorRequest />} />
            <Route path="/VendorList" element={<VendorList />} />
            <Route path="/TurfList" element={<TurfList />} />
            <Route path="/vendorlist" element={<VendorList />} />
            <Route path="/vendor-edit/:id" element={<EditVendor />} />
          </Route>


          {/* VENDOR */}
          <Route element={<VendorLayout />}>
            <Route path="/VendorDashboard" element={<VendorDashboard />} />
            <Route path="/addturf" element={<Addturf />} />
            <Route path="/discount" element={<Discount />} />
            <Route path="/VendorBookingManagement" element={<VendorBookingManagement />} />
            <Route path="/VendorLogout" element={<Vendorlogout />} />
            <Route path="/Scheduletime" element={<Scheduletime />} />
          </Route>

          {/* BOOKING */}
          <Route path="/cart" element={<Cartpage />} />
          <Route path="/galary" element={<Galarypage />} />
          <Route path="/bookingground" element={<BookingGround />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/Bookhome" element={<Bookhome />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/mybooking" element={<Mybooking />} />

          {/* OTHER */}
          <Route path="/partnerform" element={<PartnerForm />} />
          <Route path="/newonadugalam" element={<Newonadugalam />} />
          <Route path="/tennis" element={<Tennis />} />
          <Route path="/allcategories" element={<AllCategories />} />
          <Route path="/myfavourite" element={<Myfavourite />} />
          <Route path="/myreviews" element={<Myreviews />} />
          <Route path="/download" element={<h1>Coming Soon</h1>} />
          <Route path="/location" element={<Location />} />
          <Route path="/Bottomnavbar" element={<Bottomnavbar />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </RouteTransition>

      <FooterWrapper />
      <BottomNavbarWrapper />
    </Router>
  );
};

export default App;
