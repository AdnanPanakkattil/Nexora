/// customer-bill-print-design.js
(function () {
    "use strict";

    const FULL_WIDTH = 794;
    const A4_W_MM = 210;
    const A4_H_MM = 297;

    const DEFAULT_BG = window.CUSTOMER_DEFAULT_BG || "";
    const getDataUrl = window.CUSTOMER_GET_DATA_URL || "";
    const saveUrl = window.CUSTOMER_SAVE_URL || "";
    const allDataUrl = window.CUSTOMER_ALL_DATA_URL || "/invoice-print-design/all";

    const wrapper = document.getElementById("customerBillA4Wrapper");
    const bgImg = document.getElementById("customer_invoicePreviewBgImage");
    const contentBox = document.getElementById("customerBillContentBox");
    const innerContent = document.getElementById("customerBillInnerContent");
    const bgFileInput = document.getElementById("customer_background_image");
    const hiddenUrlFld = document.getElementById(
        "customer_existing_background_image_url",
    );
    const topOffsetInp = document.getElementById("customer_content_top_offset");
    const botOffsetInp = document.getElementById(
        "customer_content_bottom_offset",
    );
    const fontSizeInp = document.getElementById("customer_default_font_size");
    const fontFamilySel = document.getElementById("customer_default_font");
    const formatSel = document.getElementById("customer_format");
    const resizeChk = document.getElementById("customer_resizeBg");
    const saveBtn = document.getElementById(
        "customer_bill_print_design_save_btn",
    );
    const printBtn = document.getElementById("printCustomerBillBtn");
    const applyAllSwitch = document.getElementById(
        "customer_bill_print_design_apply_all_switch",
    );
    const branchDiv = document.getElementById("customer_branch_div");
    const branchSelect = document.getElementById("customer_branchSelect");

    const marginTop = document.getElementById("customer_margin_top");
    const marginBottom = document.getElementById("customer_margin_bottom");
    const marginLeft = document.getElementById("customer_margin_left");
    const marginRight = document.getElementById("customer_margin_right");
    const marginHeader = document.getElementById("customer_margin_header");
    const marginFooter = document.getElementById("customer_margin_footer");

    let printSettingsData = null;
    function debounce(fn, ms) {
        let t;
        return (...a) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...a), ms);
        };
    }
    function getNum(el, fallback = 0) {
        if (!el) return fallback;
        const v = parseFloat(el.value);
        return isNaN(v) ? fallback : v;
    }
    let _loader = null;

    function showLoader(msg) {
        if (!wrapper) return;
        if (!_loader) {
            _loader = document.createElement("div");
            _loader.id = "customerBillLoader";
            _loader.style.cssText = [
                "position:absolute",
                "inset:0",
                "z-index:30",
                "background:rgba(255,255,255,0.82)",
                "backdrop-filter:blur(3px)",
                "display:flex",
                "flex-direction:column",
                "align-items:center",
                "justify-content:center",
                "gap:12px",
                "border-radius:4px",
            ].join(";");
            wrapper.appendChild(_loader);
        }
        _loader.innerHTML = `
            <div class="spinner-border text-primary" role="status" style="width:2.4rem;height:2.4rem;">
                <span class="visually-hidden">Loading…</span>
            </div>
            <span style="font-size:13px;color:#444;font-weight:500;">${msg || "Loading preview…"}</span>`;
        _loader.style.display = "flex";
    }

    function hideLoader() {
        if (_loader) _loader.style.display = "none";
    }
    // FIXED - measures true height before scaling
    function recalcScale() {
        if (!contentBox || !innerContent) return;
        const availW = contentBox.clientWidth - 4;
        if (availW <= 0) return;

        // Reset transform first so scrollHeight is at true 794px width
        innerContent.style.transform = "";
        innerContent.style.width = FULL_WIDTH + "px";
        const trueH = innerContent.scrollHeight; // true unscaled height

        const scale = availW / FULL_WIDTH;
        innerContent.style.transform = `scale(${scale})`;
        innerContent.style.transformOrigin = "top left";
        contentBox.style.height = (trueH * scale) + 150 + 'px'; // exact fit, no +300 fudge
    }

    if (wrapper && window.ResizeObserver) {
        new ResizeObserver(debounce(recalcScale, 60)).observe(wrapper);
    }
    const FORMAT_RATIOS = {
        A4: "210 / 297",
        A5: "148 / 210",
        Letter: "216 / 279",
    };

    function applyFormat(fmt) {
        if (!wrapper || wrapper.dataset.customRatio) return;
        wrapper.style.aspectRatio = FORMAT_RATIOS[fmt] || FORMAT_RATIOS["A4"];
    }
    function updateLayout() {
        if (!contentBox || !wrapper) return;

        const top = getNum(marginTop);
        const bottom = getNum(marginBottom);
        const left = getNum(marginLeft);
        const right = getNum(marginRight);
        const header = getNum(marginHeader);
        const footer = getNum(marginFooter);
        const topPct = ((top + header) / A4_H_MM) * 100;
        const bottomPct = ((bottom + footer) / A4_H_MM) * 100;
        const leftPct = (left / A4_W_MM) * 100;
        const rightPct = (right / A4_W_MM) * 100;
        const extraTop = getNum(topOffsetInp);
        const extraBottom = getNum(botOffsetInp);
        const finalTop = extraTop > 0 ? extraTop : topPct;
        const finalBottom = extraBottom > 0 ? extraBottom : bottomPct;
        contentBox.style.top = finalTop + "%";
        contentBox.style.left = leftPct + "%";
        contentBox.style.right = rightPct + "%";
        // contentBox.style.bottom = "auto";
        // contentBox.style.width = "auto";
        // const scale = (contentBox.clientWidth - 6) / FULL_WIDTH;
        // const scaledH = innerContent.scrollHeight * scale;
        // contentBox.style.height = scaledH + 10 + "px";

        if (bgImg) {
            bgImg.style.objectFit =
                resizeChk && resizeChk.checked ? "contain" : "fill";
        }

        recalcScale();
    }
    function applyAppearance() {
        if (!innerContent) return;

        const fontSize = getNum(fontSizeInp, 10);
        const fontFamily =
            fontFamilySel && fontFamilySel.value
                ? fontFamilySel.value
                : "DejaVu Sans";

        innerContent.style.fontSize = fontSize + "px";
        innerContent.style.fontFamily = `'${fontFamily}', Arial, Helvetica, sans-serif`;

        if (formatSel) applyFormat(formatSel.value);

        recalcScale();
    }
    // FIXED
    function applyBgUrl(url, onDone) {
        if (!bgImg || !url) {
            hideLoader();
            return;
        }
        showLoader("Loading background…");

        // Set src immediately — don't wait for tmp image load to swap it
        bgImg.src = url;
        bgImg.style.display = "block";

        const tmp = new Image();
        tmp.onload = function () {
            if (wrapper && this.naturalWidth && this.naturalHeight) {
                // Clear old customRatio before setting new one
                delete wrapper.dataset.customRatio;
                wrapper.style.aspectRatio = `${this.naturalWidth} / ${this.naturalHeight}`;
                wrapper.dataset.customRatio = "1";
            }
            hideLoader();
            updateLayout();
            if (typeof onDone === "function") onDone();
        };
        tmp.onerror = function () {
            hideLoader();
            updateLayout();
            if (typeof onDone === "function") onDone();
        };
        tmp.src = url;
    }
    if (bgFileInput) {
        bgFileInput.addEventListener("change", function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                if (hiddenUrlFld) hiddenUrlFld.value = "";
                if (wrapper) delete wrapper.dataset.customRatio; // allow ratio to reset
                applyBgUrl(e.target.result);
            };
            reader.onerror = hideLoader;
            reader.readAsDataURL(file);
        });
    }
    document.addEventListener("click", function (e) {
        if (!e.target.closest("#customer_remove_bg_btn")) return;
        e.preventDefault();
        e.stopPropagation();

        Swal.fire({
            title: "Remove Background Image?",
            text: "Are you sure you want to remove the current background image? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true,
            showDenyButton: false,
            confirmButtonText: "Yes, remove it!",
            cancelButtonText: "No, cancel!",
            confirmButtonColor: "#e3342f",
            cancelButtonColor: "#6c757d",
            showCloseButton: false,
        }).then((result) => {
            if (!result.isConfirmed) return;

            const applyAll = applyAllSwitch && applyAllSwitch.checked ? 1 : 0;
            const csrfToken =
                document.querySelector('meta[name="csrf-token"]')?.content ??
                "";

            const body = new URLSearchParams();
            body.append("apply_all", applyAll);
            if (!applyAll && branchSelect && branchSelect.value) {
                body.append("branchSelect", branchSelect.value);
            }

            fetch(
                "/print-settings/customer-bill-print-design/remove-background",
                {
                    method: "DELETE",
                    headers: {
                        "X-CSRF-TOKEN": csrfToken,
                        "Content-Type": "application/x-www-form-urlencoded",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    body: body.toString(),
                },
            )
                .then((r) => r.json())
                .then((data) => {
                    if (data.status) {
                        if (bgFileInput) bgFileInput.value = "";
                        if (hiddenUrlFld) hiddenUrlFld.value = "";
                        if (wrapper) {
                            delete wrapper.dataset.customRatio;
                            wrapper.style.aspectRatio = "";
                        }
                        if (bgImg) {
                            const def =
                                DEFAULT_BG || bgImg.dataset.defaultSrc || "";
                            bgImg.src = def;
                            bgImg.style.objectFit = "fill";
                            bgImg.style.display = def ? "block" : "none";
                        }
                        const hint = document.getElementById(
                            "customer_bg_filename",
                        );
                        if (hint) hint.style.display = "none";
                        if (formatSel) applyFormat(formatSel.value);
                        updateLayout();

                        Swal.fire({
                            title: "Removed!",
                            text: "Background image removed successfully.",
                            icon: "success",
                            showConfirmButton: true,
                            showCancelButton: false,
                            showDenyButton: false,
                            confirmButtonText: "OK",
                            confirmButtonColor: "#28a745",
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: data.error || "Failed to remove background.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                })
                .catch(() => {
                    Swal.fire({
                        title: "Error!",
                        text: "An error occurred.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                });
        });
    });
    [
        "customer_margin_top",
        "customer_margin_bottom",
        "customer_margin_left",
        "customer_margin_right",
        "customer_margin_header",
        "customer_margin_footer",
        "customer_content_top_offset",
        "customer_content_bottom_offset",
    ].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", updateLayout);
    });

    if (fontSizeInp) fontSizeInp.addEventListener("input", applyAppearance);
    if (fontFamilySel)
        fontFamilySel.addEventListener("change", applyAppearance);
    if (formatSel)
        formatSel.addEventListener("change", () => {
            applyFormat(formatSel.value);
            recalcScale();
        });
    if (resizeChk) resizeChk.addEventListener("change", updateLayout);
    function setVal(id, val) {
        const el = document.getElementById(id);
        if (el && val !== null && val !== undefined && val !== "")
            el.value = val;
    }
    function fillCustomerForm(settings) {
        if (!settings) {
            clearCustomerForm();
            return;
        }
        const d = settings.design ?? settings;

        setVal("customer_margin_top", d.margin_top);
        setVal("customer_margin_bottom", d.margin_bottom);
        setVal("customer_margin_left", d.margin_left);
        setVal("customer_margin_right", d.margin_right);
        setVal("customer_margin_header", d.margin_header);
        setVal("customer_margin_footer", d.margin_footer);
        setVal("customer_default_font_size", d.default_font_size);
        setVal("customer_content_top_offset", d.content_top_offset);
        setVal("customer_content_bottom_offset", d.content_bottom_offset);

        if (fontFamilySel && d.default_font)
            fontFamilySel.value = d.default_font;
        if (formatSel && d.format) formatSel.value = d.format;
        if (resizeChk && d.background_resize !== undefined) {
            resizeChk.checked = !!d.background_resize;
        }

        applyAppearance();
        const bgUrl = d.background_image_url || null;
        if (bgUrl) {
            if (hiddenUrlFld) hiddenUrlFld.value = bgUrl;
            if (wrapper) delete wrapper.dataset.customRatio;
            applyBgUrl(bgUrl);
            const fileName = bgUrl.split("/").pop();
            let hint = document.getElementById("customer_bg_filename");
            if (!hint) {
                hint = document.createElement("small");
                hint.id = "customer_bg_filename";
                hint.className = "text-success d-block mt-1";
                if (bgFileInput && bgFileInput.parentNode)
                    bgFileInput.parentNode.appendChild(hint);
            }
            hint.textContent = "Current Image: " + fileName;
            hint.style.display = "";
            const removeBtn = document.getElementById("customer_remove_bg_btn");
            if (removeBtn) removeBtn.style.display = "";
        } else {
            if (hiddenUrlFld) hiddenUrlFld.value = "";
            const hint = document.getElementById("customer_bg_filename");
            if (hint) hint.style.display = "none";
        }
        updateLayout();
    }
    function clearCustomerForm() {
        [
            "customer_margin_top",
            "customer_margin_bottom",
            "customer_margin_left",
            "customer_margin_right",
            "customer_margin_header",
            "customer_margin_footer",
            "customer_default_font_size",
            "customer_content_top_offset",
            "customer_content_bottom_offset",
        ].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });

        if (fontFamilySel) fontFamilySel.value = "";
        if (formatSel) formatSel.value = "";
        if (resizeChk) resizeChk.checked = false;
        if (hiddenUrlFld) hiddenUrlFld.value = "";

        const hint = document.getElementById("customer_bg_filename");
        if (hint) hint.style.display = "none";

        updateLayout();
    }
    function handleApplyAllChange() {
        if (!applyAllSwitch) return;
        const applyAll = applyAllSwitch.checked;
        if (branchDiv) branchDiv.style.display = applyAll ? "none" : "";

        if (applyAll) {
            if (printSettingsData?.global_customer_bill)
                fillCustomerForm(printSettingsData.global_customer_bill);
        } else {
            const branchId = branchSelect ? branchSelect.value : null;
            if (branchId) {
                const bd = printSettingsData?.branch_customer_bill?.find(
                    (x) => String(x.clinicId) === String(branchId),
                );
                bd ? fillCustomerForm(bd) : clearCustomerForm();
            } else {
                clearCustomerForm();
            }
        }
    }

    function handleBranchChange() {
        if (!branchSelect) return;
        const branchId = branchSelect.value;

        if (applyAllSwitch && applyAllSwitch.checked) {
            if (printSettingsData?.global_customer_bill)
                fillCustomerForm(printSettingsData.global_customer_bill);
            return;
        }

        if (branchId) {
            const bd = printSettingsData?.branch_customer_bill?.find(
                (x) => String(x.clinicId) === String(branchId),
            );
            bd ? fillCustomerForm(bd) : clearCustomerForm();
        } else {
            clearCustomerForm();
        }
    }
    if (applyAllSwitch)
        applyAllSwitch.addEventListener("change", handleApplyAllChange);
    if (branchSelect)
        branchSelect.addEventListener("change", handleBranchChange);
    if (typeof $ !== "undefined" && branchSelect) {
        $(branchSelect).on("change", handleBranchChange);
    }

    function reloadCustomerPrintDesignData() {
        fetch(allDataUrl, { headers: { "X-Requested-With": "XMLHttpRequest" } })
            .then((r) => r.json())
            .then((response) => {
                if (!response.status) return;
                printSettingsData = response.data;

                const applyAll = applyAllSwitch && applyAllSwitch.checked;
                if (applyAll) {
                    if (printSettingsData?.global_customer_bill)
                        fillCustomerForm(printSettingsData.global_customer_bill);
                } else {
                    const branchId = branchSelect ? branchSelect.value : null;
                    if (branchId) {
                        const bd = printSettingsData?.branch_customer_bill?.find(
                            (x) => String(x.clinicId) === String(branchId),
                        );
                        if (bd) fillCustomerForm(bd);
                    }
                }
            })
            .catch((err) => console.error("Customer bill: reload failed", err));
    }
    showLoader("Loading settings…");

    fetch(allDataUrl, { headers: { "X-Requested-With": "XMLHttpRequest" } })
        .then((r) => r.json())
        .then((response) => {
            if (!response.status) return;
            printSettingsData = response.data;

            const isApplyAll =
                printSettingsData?.global_customer_bill &&
                (!printSettingsData?.branch_customer_bill ||
                    printSettingsData.branch_customer_bill.length === 0);

            if (isApplyAll && applyAllSwitch) {
                applyAllSwitch.checked = true;
                if (branchDiv) branchDiv.style.display = "none";
                fillCustomerForm(printSettingsData.global_customer_bill);
            } else {
                return fetch(getDataUrl, {
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                })
                    .then((r) => r.json())
                    .then((res) => {
                        if (!res.status || !res.data) return;
                        fillCustomerForm(res.data);
                    });
            }
        })
        .catch((err) => {
            console.error("Customer bill: failed to load settings", err);
            applyBgUrl(DEFAULT_BG);
        })
        .finally(() => {
            setTimeout(() => {
                hideLoader();
                recalcScale();
            }, 3000);
        });

    if (saveBtn) {
        saveBtn.addEventListener("click", function () {
            const applyAll = applyAllSwitch && applyAllSwitch.checked ? 1 : 0;
            if (!applyAll && (!branchSelect || !branchSelect.value)) {
                Swal.fire({
                    title: "Branch Required",
                    text: 'Please select a branch, or enable "Same layout for all branches".',
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return;
            }

            const form = document.getElementById("customer_bill_full_form");
            if (!form) return;

            // Preserve current bg URL if no new file selected
            if (
                hiddenUrlFld &&
                !hiddenUrlFld.value &&
                bgImg &&
                bgImg.src &&
                !bgImg.src.startsWith("data:") &&
                bgImg.src !== window.location.href
            ) {
                hiddenUrlFld.value = bgImg.src;
            }

            // const applyAll = applyAllSwitch && applyAllSwitch.checked ? 1 : 0;
            const formData = new FormData(form);
            formData.set("apply_all", applyAll);

            if (!applyAll && branchSelect && branchSelect.value) {
                formData.set("branchSelect", branchSelect.value);
            }

            const csrfToken =
                document.querySelector('meta[name="csrf-token"]')?.content ??
                "";
            const origHtml = saveBtn.innerHTML;
            saveBtn.disabled = true;
            saveBtn.innerHTML =
                '<span class="spinner-border spinner-border-sm me-1"></span> Saving…';

            fetch(saveUrl, {
                method: "POST",
                body: formData,
                headers: { "X-CSRF-TOKEN": csrfToken },
            })
                .then((r) => r.json())
                .then((data) => {
                    if (data.status) {
                        if (typeof Swal !== "undefined") {
                            Swal.fire({
                                title: "Success!",
                                text: data.msg,
                                icon: "success",
                                confirmButtonText: "OK",
                                timer: 3000,
                                showConfirmButton: true,
                            });
                        } else if (typeof toastr !== "undefined") {
                            toastr.success(data.msg ?? "Saved successfully.");
                        } else {
                            alert(data.msg ?? "Saved successfully.");
                        }

                        if (data.data?.background_image_url) {
                            if (hiddenUrlFld)
                                hiddenUrlFld.value =
                                    data.data.background_image_url;
                            applyBgUrl(data.data.background_image_url);
                        }

                        reloadCustomerPrintDesignData();
                    } else {
                        if (typeof Swal !== "undefined") {
                            Swal.fire({
                                title: "Error!",
                                text:
                                    data.msg ||
                                    data.error ||
                                    "Something went wrong",
                                icon: "error",
                                confirmButtonText: "OK",
                            });
                        } else if (typeof toastr !== "undefined") {
                            toastr.error(
                                data.error ?? data.msg ?? "Save failed.",
                            );
                        } else {
                            alert(data.error ?? data.msg ?? "Save failed.");
                        }
                    }
                })
                .catch(() => {
                    if (typeof Swal !== "undefined") {
                        Swal.fire({
                            title: "Error!",
                            text: "An error occurred while saving.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    } else {
                        alert("An error occurred while saving.");
                    }
                })
                .finally(() => {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = origHtml;
                });
        });
    }
    if (printBtn) {
        printBtn.addEventListener("click", function () {
            const printContents =
                document.getElementById("customerBillA4Wrapper")?.outerHTML ||
                "";
            const printWindow = window.open(
                "",
                "_blank",
                "width=900,height=1200",
            );
            if (!printWindow) return;

            printWindow.document.write(`
                <html>
                <head>
                    <title>Customer Bill Preview</title>
                    <style>
                        @page { size: A4; margin: 0; }
                        body  { margin: 0; }
                        #customerBillA4Wrapper {
                            width: 210mm; height: 297mm;
                            position: relative; overflow: hidden;
                        }
                        #customer_invoicePreviewBgImage {
                            position: absolute; top: 0; left: 0;
                            width: 100%; height: 100%; object-fit: fill;
                        }
                        #customerBillContentBox {
                            position: absolute;
                            box-sizing: border-box;
                            border: 1.5px solid #222;
                            background: transparent;
                            overflow: hidden;
                        }
                        #customerBillInnerContent {
                            transform-origin: top left;
                            width: 794px;
                        }
                    </style>
                </head>
                <body>${printContents}</body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 400);
        });
    }

    window.addEventListener("load", () => {
        updateLayout();
        applyAppearance();
    });

    // ── Customer Bill Design for Billing/Pending Bill ──────────────────────────

    /**
     * Fetch the saved customer-bill print design for a given branch (or global).
     * @param {number|null} clinicId  - current branch ID, or null for global
     * @returns {Promise<object>}     - resolves to the design object
     */
    async function fetchCustomerBillDesign(clinicId) {
        try {
            const url = clinicId
                ? `/settings/customer-bill/data?clinic_id=${clinicId}`
                : `/settings/customer-bill/data`;

            const res = await fetch(url, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            const json = await res.json();
            return json.status ? json.data : null;
        } catch (err) {
            console.error("fetchCustomerBillDesign error:", err);
            return null;
        }
    }

    /**
     * Build the CSS @page + body rules from the saved design and inject them
     * into a <style> tag in the given print window.
     */
    function buildCustomerBillPrintStyles(design) {
        const mmOrFallback = (v, fb) => (parseFloat(v) || fb) + "mm";

        const marginTop = mmOrFallback(design.margin_top, 10);
        const marginBottom = mmOrFallback(design.margin_bottom, 10);
        const marginLeft = mmOrFallback(design.margin_left, 8);
        const marginRight = mmOrFallback(design.margin_right, 8);
        const marginHeader = mmOrFallback(design.margin_header, 0);
        const marginFooter = mmOrFallback(design.margin_footer, 0);
        const fontSize = (parseFloat(design.default_font_size) || 10) + "px";
        const fontFamily = design.default_font || "DejaVu Sans";
        const format = design.format || "A4";
        const bgUrl = design.background_image_url || "";
        const objectFit = design.background_resize ? "contain" : "fill";

        // Content area offset (% from top)
        const A4_H_MM = 297,
            A4_W_MM = 210;
        const topPct =
            parseFloat(design.content_top_offset) > 0
                ? parseFloat(design.content_top_offset)
                : ((parseFloat(design.margin_top || 0) +
                      parseFloat(design.margin_header || 0)) /
                      A4_H_MM) *
                  100;
        const leftPct = Math.min(
            (parseFloat(design.margin_left || 0) / A4_W_MM) * 100,
            10,
        );
        const rightPct = Math.min(
            (parseFloat(design.margin_right || 0) / A4_W_MM) * 100,
            10,
        );

        return `
        @page { size: ${format}; margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft}; }
        body  { margin: 0; font-family: '${fontFamily}', Arial, sans-serif; font-size: ${fontSize}; }

        #customerBillPrintWrapper {
            width: 210mm; min-height: 297mm;
            position: relative; overflow: hidden;
        }
        #customerBillPrintBg {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 100%;
            object-fit: ${objectFit};
        }
        #customerBillPrintContent {
            position: absolute;
            top: ${topPct}%;
            left: ${leftPct}%;
            right: ${rightPct}%;
            box-sizing: border-box;
        }
    `;
    }

    /**
     * Main entry point — call this when the user clicks "Print" on a customer bill row.
     * @param {string} billHtml  - the rendered bill HTML (tables etc.)
     * @param {number|null} clinicId
     */
    async function printCustomerBill(billHtml, clinicId) {
        const design = await fetchCustomerBillDesign(clinicId);
        const styles = design ? buildCustomerBillPrintStyles(design) : "";
        const bgUrl = design?.background_image_url || "";

        const printWindow = window.open("", "_blank", "width=900,height=1200");
        if (!printWindow) return;

        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Customer Bill</title>
            <style>${styles}</style>
        </head>
        <body>
            <div id="customerBillPrintWrapper">
                ${bgUrl ? `<img id="customerBillPrintBg" src="${bgUrl}" alt="">` : ""}
                <div id="customerBillPrintContent">
                    ${billHtml}
                </div>
            </div>
        </body>
        </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }

    // ── Hook into your existing pending-bill print action ───────────────────
    $(document).on("click", ".print-customer-bill-btn", async function () {
        const row = $(this).closest("tr");
        const billId = row.data("bill-id");
        const clinicId = row.data("clinic-id");

        try {
            const res = await fetch(`/billing/customer-bill-content/${billId}`, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            const json = await res.json();
            if (!json.status)
                throw new Error(json.error || "Failed to load bill");

            await printCustomerBill(json.html, clinicId);
        } catch (err) {
            console.error("Print customer bill error:", err);
            Swal.fire({ title: "Error", text: err.message, icon: "error" });
        }
    });
})();