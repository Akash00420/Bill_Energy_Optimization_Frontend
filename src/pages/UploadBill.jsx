import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadBill, clearError } from "../Reducer/BillSlice";
import "../assets/custom.css";

const initialForm = {
  consumerNumber: "",
  customerName: "",
  address: "",
  consumerType: "Domestic",
  billMonth: "",
  billDate: "",
  dueDate: "",
  unitsBilled: "",
  energyCharges: "",
  fixedDemandCharges: "",
  govtDuty: "",
  meterRent: "",
  adjustments: "",
  grossAmount: "",
  rebate: "",
  netAmount: "",
  loadKVA: "",
  securityDeposit: "",
};

const UploadBill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.bill);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => { dispatch(clearError()); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
  };

  const saved =
    (parseFloat(form.grossAmount) || 0) - (parseFloat(form.netAmount) || 0);
  const ratePerUnit =
    form.unitsBilled > 0 && form.energyCharges > 0
      ? (parseFloat(form.energyCharges) / parseFloat(form.unitsBilled)).toFixed(2)
      : "0.00";

  const validate = () => {
    const required = [
      "consumerNumber","customerName","billMonth","billDate",
      "dueDate","unitsBilled","grossAmount","netAmount",
    ];
    for (let f of required) {
      if (!form[f]) {
        setFormError(`Please fill in: ${f.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }
    if (!file) { setFormError("Please attach your bill image or PDF"); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const result = await dispatch(uploadBill({ file, ...form }));
    if (uploadBill.fulfilled.match(result)) navigate("/dashboard");
  };

  return (
    <div className="ub-page">
      <div className="ub-wrap">

        {/* ── Page Header ── */}
        <div className="ub-page-header">
          <h1>Add Electricity Bill</h1>
          <p>Enter your bill details to get personalised savings insights</p>
        </div>

        {(error || formError) && (
          <div className="ub-error">❌ {formError || error}</div>
        )}

        {/* ── Card 1: Consumer Details ── */}
        <div className="ub-card">
          <div className="ub-card-header">
            <div className="ub-accent blue"></div>
            <div className="ub-step-badge blue">1</div>
            <div>
              <h3>Consumer Details</h3>
              <p>Basic account information from your bill header</p>
            </div>
          </div>
          <div className="ub-grid2">
            <div className="ub-field">
              <label>Consumer Number <span className="ub-req">*</span></label>
              <input
                name="consumerNumber"
                value={form.consumerNumber}
                onChange={handleChange}
                placeholder="e.g. 12000826491"
              />
            </div>
            <div className="ub-field">
              <label>Customer Name <span className="ub-req">*</span></label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Full name on bill"
              />
            </div>
            <div className="ub-field">
              <label>Consumer Type</label>
              <select name="consumerType" value={form.consumerType} onChange={handleChange}>
                <option value="Domestic">Domestic</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
            <div className="ub-field">
              <label>Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address on bill"
              />
            </div>
          </div>
        </div>

        {/* ── Card 2: Bill Period & Usage ── */}
        <div className="ub-card">
          <div className="ub-card-header">
            <div className="ub-accent green"></div>
            <div className="ub-step-badge green">2</div>
            <div>
              <h3>Bill Period &amp; Usage</h3>
              <p>Dates and consumption figures from your bill</p>
            </div>
          </div>
          <div className="ub-grid3">
            <div className="ub-field">
              <label>Bill Month <span className="ub-req">*</span></label>
              <input
                name="billMonth"
                value={form.billMonth}
                onChange={handleChange}
                placeholder="MM/YYYY"
              />
            </div>
            <div className="ub-field">
              <label>Bill Date <span className="ub-req">*</span></label>
              <input name="billDate" type="date" value={form.billDate} onChange={handleChange} />
            </div>
            <div className="ub-field">
              <label>Due Date <span className="ub-req">*</span></label>
              <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
            </div>
          </div>

          <div className="ub-divider"></div>

          <div className="ub-grid3">
            <div className="ub-field">
              <label>Units Billed (kWh) <span className="ub-req">*</span></label>
              <input
                name="unitsBilled" type="number"
                value={form.unitsBilled} onChange={handleChange}
                placeholder="e.g. 36"
              />
            </div>
            <div className="ub-field">
              <label>Load (KVA)</label>
              <input
                name="loadKVA" type="number"
                value={form.loadKVA} onChange={handleChange}
                placeholder="e.g. 0.4"
              />
            </div>
            <div className="ub-field">
              <label>Security Deposit (₹)</label>
              <div className="ub-prefix">
                <input
                  name="securityDeposit" type="number"
                  value={form.securityDeposit} onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 3: Charges Breakdown ── */}
        <div className="ub-card">
          <div className="ub-card-header">
            <div className="ub-accent amber"></div>
            <div className="ub-step-badge amber">3</div>
            <div>
              <h3>Charges Breakdown</h3>
              <p>All charge components from the bill details section</p>
            </div>
          </div>
          <div className="ub-grid2">
            <div className="ub-field">
              <label>Energy Charges (₹)</label>
              <div className="ub-prefix">
                <input name="energyCharges" type="number" value={form.energyCharges} onChange={handleChange} placeholder="0" />
              </div>
            </div>
            <div className="ub-field">
              <label>Fixed / Demand Charges (₹)</label>
              <div className="ub-prefix">
                <input name="fixedDemandCharges" type="number" value={form.fixedDemandCharges} onChange={handleChange} placeholder="0" />
              </div>
            </div>
            <div className="ub-field">
              <label>Govt Duty (₹)</label>
              <div className="ub-prefix">
                <input name="govtDuty" type="number" value={form.govtDuty} onChange={handleChange} placeholder="0" />
              </div>
            </div>
            <div className="ub-field">
              <label>Meter Rent (₹)</label>
              <div className="ub-prefix">
                <input name="meterRent" type="number" value={form.meterRent} onChange={handleChange} placeholder="0" />
              </div>
            </div>
            <div className="ub-field">
              <label>Adjustments (₹)</label>
              <div className="ub-prefix">
                <input name="adjustments" type="number" value={form.adjustments} onChange={handleChange} placeholder="0" />
              </div>
            </div>
            <div className="ub-field">
              <label>Rebate (₹)</label>
              <div className="ub-prefix">
                <input name="rebate" type="number" value={form.rebate} onChange={handleChange} placeholder="0" />
              </div>
            </div>
          </div>

          <div className="ub-divider"></div>

          <div className="ub-grid2">
            <div className="ub-field">
              <label>Gross Amount (₹) <span className="ub-req">*</span></label>
              <div className="ub-prefix">
                <input
                  name="grossAmount" type="number"
                  value={form.grossAmount} onChange={handleChange}
                  placeholder="0" className="ub-big-input"
                />
              </div>
            </div>
            <div className="ub-field">
              <label>Net Amount Payable (₹) <span className="ub-req">*</span></label>
              <div className="ub-prefix">
                <input
                  name="netAmount" type="number"
                  value={form.netAmount} onChange={handleChange}
                  placeholder="0" className="ub-big-input"
                />
              </div>
            </div>
          </div>

          {/* ── Summary Bar ── */}
          <div className="ub-summary-bar">
            <div className="ub-s-card">
              <div className="ub-s-label">Total Charges</div>
              <div className="ub-s-val">
                ₹{parseFloat(form.grossAmount || 0).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="ub-s-card">
              <div className="ub-s-label">Payable</div>
              <div className="ub-s-val">
                ₹{parseFloat(form.netAmount || 0).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="ub-s-card green">
              <div className="ub-s-label green">You Saved</div>
              <div className="ub-s-val green">₹{saved.toLocaleString("en-IN")}</div>
            </div>
            <div className="ub-s-card amber">
              <div className="ub-s-label amber">Rate / Unit</div>
              <div className="ub-s-val amber">₹{ratePerUnit}</div>
            </div>
          </div>
        </div>

        {/* ── Card 4: Attach Bill ── */}
        <div className="ub-card">
          <div className="ub-card-header" style={{ marginBottom: 0 }}>
            <div className="ub-accent" style={{ background: "#8b5cf6" }}></div>
            <div className="ub-step-badge" style={{ background: "#ede9fe", color: "#6d28d9" }}>4</div>
            <div>
              <h3>Attach Bill</h3>
              <p>Upload a photo or PDF of your bill (optional)</p>
            </div>
          </div>
          <div
            className="ub-dropzone"
            onClick={() => document.getElementById("ub-file-input").click()}
          >
            {file ? (
              <span className="ub-file-name">✅ {file.name}</span>
            ) : (
              <span className="ub-file-placeholder">📎 Click to attach bill image or PDF</span>
            )}
            <input
              id="ub-file-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files[0];
                if (f && f.size <= 10 * 1024 * 1024) setFile(f);
                else if (f) alert("File must be under 10MB");
              }}
            />
          </div>
        </div>

        {/* ── Submit ── */}
        <button className="ub-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Saving your bill..." : "⚡ Analyse My Bill"}
        </button>

        {/* ── Supported Boards ── */}
        <div className="ub-tags">
          {["CESC", "MSEDCL", "BESCOM", "TPDDL", "KSEB", "+ more boards"].map((t) => (
            <span key={t} className="ub-tag">{t}</span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default UploadBill;