import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBill } from "../Reducer/BillSlice";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const UploadBill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.bill);

  const [formData, setFormData] = useState({
    consumerNumber: "",
    customerName: "",
    billMonth: "",
    billDate: "",
    dueDate: "",
    unitsBilled: "",
    grossAmount: "",
    netAmount: "",
    energyCharges: "",
    fixedDemandCharges: "",
    govtDuty: "",
    meterRent: "",
    rebate: "",
    adjustments: "",
    consumerType: "Domestic",
    paymentStatus: "Pending",
    address: "",
    loadKVA: "",
    securityDeposit: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // convert number fields from string to number
    const payload = {
      ...formData,
      unitsBilled: Number(formData.unitsBilled),
      grossAmount: Number(formData.grossAmount),
      netAmount: Number(formData.netAmount),
      energyCharges: Number(formData.energyCharges),
      fixedDemandCharges: Number(formData.fixedDemandCharges),
      govtDuty: Number(formData.govtDuty),
      meterRent: Number(formData.meterRent),
      rebate: Number(formData.rebate),
      adjustments: Number(formData.adjustments),
      loadKVA: Number(formData.loadKVA),
      securityDeposit: Number(formData.securityDeposit),
    };

    const result = await dispatch(createBill(payload));

    if (createBill.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="upload-page">
      <div className="upload-card" style={{ maxWidth: "600px" }}>
        <h2>📋 Enter Bill Details</h2>
        <p>Fill in your electricity bill details for analysis.</p>

        {error && (
          <p style={{ color: "red", marginBottom: "12px" }}>❌ {error}</p>
        )}

        <form onSubmit={handleSubmit}>

          {/* ── Required Fields ─────────────────────── */}
          <div className="form-section">
            <h4>Required Info</h4>

            <div className="form-group">
              <label>Consumer Number *</label>
              <input
                name="consumerNumber"
                value={formData.consumerNumber}
                onChange={handleChange}
                placeholder="e.g. 123456789"
                required
              />
            </div>

            <div className="form-group">
              <label>Customer Name *</label>
              <input
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="e.g. Akash Ghosh"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bill Month *</label>
                <input
                  name="billMonth"
                  value={formData.billMonth}
                  onChange={handleChange}
                  placeholder="e.g. 02/2025"
                  required
                />
              </div>
              <div className="form-group">
                <label>Consumer Type</label>
                <select name="consumerType" value={formData.consumerType} onChange={handleChange}>
                  <option value="Domestic">Domestic</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Bill Date *</label>
                <input
                  type="date"
                  name="billDate"
                  value={formData.billDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Units Billed (kWh) *</label>
              <input
                type="number"
                name="unitsBilled"
                value={formData.unitsBilled}
                onChange={handleChange}
                placeholder="e.g. 320"
                min="0"
                required
              />
            </div>
          </div>

          {/* ── Amount Fields ────────────────────────── */}
          <div className="form-section">
            <h4>Bill Amounts (₹)</h4>

            <div className="form-row">
              <div className="form-group">
                <label>Gross Amount *</label>
                <input
                  type="number"
                  name="grossAmount"
                  value={formData.grossAmount}
                  onChange={handleChange}
                  placeholder="e.g. 1900"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Net Amount *</label>
                <input
                  type="number"
                  name="netAmount"
                  value={formData.netAmount}
                  onChange={handleChange}
                  placeholder="e.g. 1850"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Energy Charges</label>
                <input type="number" name="energyCharges" value={formData.energyCharges} onChange={handleChange} placeholder="0" min="0" />
              </div>
              <div className="form-group">
                <label>Fixed/Demand Charges</label>
                <input type="number" name="fixedDemandCharges" value={formData.fixedDemandCharges} onChange={handleChange} placeholder="0" min="0" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Govt Duty</label>
                <input type="number" name="govtDuty" value={formData.govtDuty} onChange={handleChange} placeholder="0" min="0" />
              </div>
              <div className="form-group">
                <label>Meter Rent</label>
                <input type="number" name="meterRent" value={formData.meterRent} onChange={handleChange} placeholder="0" min="0" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rebate</label>
                <input type="number" name="rebate" value={formData.rebate} onChange={handleChange} placeholder="0" min="0" />
              </div>
              <div className="form-group">
                <label>Adjustments</label>
                <input type="number" name="adjustments" value={formData.adjustments} onChange={handleChange} placeholder="0" />
              </div>
            </div>
          </div>

          {/* ── Optional Fields ──────────────────────── */}
          <div className="form-section">
            <h4>Optional Info</h4>

            <div className="form-group">
              <label>Address</label>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Consumer address" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Load (KVA)</label>
                <input type="number" name="loadKVA" value={formData.loadKVA} onChange={handleChange} placeholder="0" min="0" />
              </div>
              <div className="form-group">
                <label>Security Deposit</label>
                <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} placeholder="0" min="0" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-upload-submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "⚡ Analyse My Bill"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default UploadBill;