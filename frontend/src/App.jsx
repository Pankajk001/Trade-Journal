import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import { Loading } from "./components/WorkspaceUI";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Journal = lazy(() => import("./pages/Journal"));
const Statistics = lazy(() => import("./pages/Statistics"));
const AddTrade = lazy(() => import("./pages/AddTrade"));
const TradeDetails = lazy(() => import("./pages/TradeDetails"));
const Settings = lazy(() => import("./pages/Settings"));
const Library = lazy(() => import("./pages/Library"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Accounts = lazy(() => import("./pages/Accounts"));
const DailyReview = lazy(() => import("./pages/DailyReview"));
const Markets = lazy(() => import("./pages/Markets"));
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/forgot-password" element={<Auth mode="forgot" />} />
          <Route path="/reset-password" element={<Auth mode="reset" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="journal" element={<Journal />} />
            <Route path="markets" element={<Markets key="markets" />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="add-trade" element={<AddTrade />} />
            <Route path="trade/:id" element={<TradeDetails />} />
            <Route path="trade/:id/edit" element={<AddTrade />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="review" element={<DailyReview />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="strategies"
              element={<Library kind="strategies" key="strategies" />}
            />
            <Route
              path="mistakes"
              element={<Library kind="mistakes" key="mistakes" />}
            />
            <Route
              path="notes"
              element={<Library kind="notes" key="notes" />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
