class AccountLedgerManager {
    constructor() {
        this.tree = null;
        this.currentAccountId = null;
        this.ledgerData = null;
        this.init();
    }

    init() {
        this.setActiveMenu();
        this.loadInitialData();
        this.bindEvents();
        this.initSubAccountForm();
    }

    setActiveMenu() {
        $("#accounts_main_menu").addClass("active open menu-item-animating");
        $("#account_ledger_sub_menu").addClass("active");
        $("#account_section").show();
    }

    loadInitialData() {
        const selectedBranches = $("#select-branch").val();
        $.ajax({
            url: "/get-ledger-data",
            type: "GET",
            data: {
                clinic_ids: selectedBranches
                    ? Array.isArray(selectedBranches)
                        ? selectedBranches
                        : [selectedBranches]
                    : [],
            },
            success: (response) => {
                if (response.success) {
                    this.ledgerData = response;
                    this.initializeTree(response.tree);
                    this.renderAccountList(response.accounts);
                }
            },
            error: (xhr) => {
                console.error(
                    "Error loading initial ledger data:",
                    xhr.responseText,
                );
                this.showError("Failed to load ledger data.");
            },
        });
    }

    initializeTree(treeData) {
        const theme = $("html").hasClass("light-style")
            ? "default"
            : "default-dark";
        const $tree = $("#ledger-tree");

        if ($tree.length) {
            if ($tree.jstree(true)) {
                $tree.jstree(true).destroy();
            }

            $tree.jstree({
                core: {
                    themes: { name: theme },
                    data: treeData,
                },
                plugins: ["types"],
            });

            this.tree = $tree.jstree(true);

            $tree
                .off("select_node.jstree")
                .on("select_node.jstree", (e, data) => {
                    this.handleTreeNodeSelection(data);
                });

            $tree.on("ready.jstree", () => {
                this.tree.open_node("root_accounts");
            });
        }
    }

    bindEvents() {
        $(document).on("click", ".account-head-item", (e) => {
            const accountHeadId = $(e.currentTarget).data("id");
            this.focusTreeNodeByTypeAndId("account", accountHeadId);
        });

        $(document).on("click", ".sub-account-head-item", (e) => {
            const accountHeadId = $(e.currentTarget).data("id");
            const subAccountId = $(e.currentTarget).data("sub-id");
            this.focusTreeNodeByTypeAndId(
                "subaccount",
                subAccountId,
                accountHeadId,
            );
        });

        $(document).on("click", ".journal-item", (e) => {
            const journalId = $(e.currentTarget).data("journal-id");

            const $item = $(e.currentTarget);
            const subAccountId = $item.data("sub-id");
            const accountId = $item.data("account-id");

            const particulars = $item.find(".list-content h6").text();
            this.focusTreeNodeByTypeAndId(
                "journal",
                journalId,
                accountId,
                subAccountId,
                particulars,
            );
        });

        $(document).on("click", "#AccountHeadModalBtn", () => {
            this.loadAccountTypes();
            this.resetAccountHeadForm();
        });

        $("#accountHeadModal").on("hidden.bs.modal", () => {
            this.resetAccountHeadForm();
        });

        $("#subAccountHeadModal").on("shown.bs.modal", () => {
            this.populateAccountHeadSelectFromLocalData();
        });

        $("#subAccountHeadModal").on("hidden.bs.modal", () => {
            this.resetSubAccountHeadForm();
        });

        $(document).on("click", "#saveAccountHead", (e) => {
            e.preventDefault();
            this.saveAccountHead();
        });

        $(document).on("click", "#saveSubAccountHead", (e) => {
            e.preventDefault();
            this.saveSubAccountHead(e);
        });

        $("#ledger-tree").on("ready.jstree", () => {
            console.log("Tree initialized successfully");
        });
    }

    initSubAccountForm() {
        const $select = $("#radio_select");
        const $wrapper = $("#radio_select_wrapper");
        const $subAccountHeadWrapper = $("#sub_account_head_wrapper");
        const $subAccountCodeWrapper = $("#sub_account_code_wrapper");
        const $subAccountHead = $("#subAccountHead");
        const $subAccountCode = $("#subAccountCode");

        const initSelect2 = (url, placeholder) => {
            $select.select2({
                placeholder: placeholder,
                allowClear: true,
                minimumInputLength: 2,
                dropdownParent: $("#subAccountHeadModal"),
                ajax: {
                    url: url,
                    dataType: "json",
                    delay: 300,
                    data: function (params) {
                        return { search: params.term };
                    },
                    processResults: function (data) {
                        return {
                            results: data.map((item) => ({
                                id:
                                    item.regularCustomerId ||
                                    item.clientId ||
                                    item.vendorId,
                                text:
                                    item.customerName ||
                                    item.clientName_en ||
                                    item.vendor_name_en,
                                code:
                                    item.customerNo ||
                                    item.clientId ||
                                    item.vendor_code,
                            })),
                        };
                    },
                },
            });
        };

        $('input[name="inlineRadioOptions"]').change(function () {
            const selectedValue = $(this).val();
            let ajaxUrl = "",
                placeholderText = "";

            switch (selectedValue) {
                case "vendor":
                    ajaxUrl = "/get-vendors";
                    placeholderText = "Search Vendor";
                    break;
                case "customer":
                    ajaxUrl = "/get-customers";
                    placeholderText = "Search Customer";
                    break;
                case "patient":
                    ajaxUrl = "/get-clients";
                    placeholderText = "Search Patient";
                    break;
                default:
                    $wrapper.hide();
                    $select.empty().select2("destroy");
                    $subAccountHeadWrapper.show();
                    $subAccountCodeWrapper.show();
                    $subAccountHead.val("");
                    $subAccountCode.val("");
                    return;
            }

            $wrapper.show();
            $subAccountHeadWrapper.hide();
            $subAccountCodeWrapper.hide();
            if ($.fn.select2 && $select.data("select2")) {
                $select.select2("destroy");
            }
            $select.empty();
            initSelect2(ajaxUrl, placeholderText);
        });

        $select.on("select2:select", function (e) {
            $("#subAccountCode").val(e.params.data.code);
            $("#subAccountHead").val(e.params.data.text);
        });
    }

    focusTreeNodeByTypeAndId(
        type,
        id,
        accountId = null,
        subAccountId = null,
        particulars = null,
    ) {
        if (!this.tree) return;

        let nodeId;

        switch (type) {
            case "account":
                nodeId = `account_${id}`;
                this.tree.deselect_all();
                this.tree.open_node("root_accounts", () => {
                    this.tree.select_node(nodeId);
                });
                break;

            case "subaccount":
                const accountNodeId = `account_${accountId}`;
                nodeId = `subaccount_${id}`;
                this.tree.deselect_all();
                this.tree.open_node(accountNodeId, () => {
                    this.tree.select_node(nodeId);
                });
                break;

            case "journal":
                const parentAccountId = `account_${accountId}`;
                const parentSubId = `subaccount_${subAccountId}`;
                nodeId = `journal_${id}`;

                this.tree.deselect_all();
                this.tree.open_node(parentAccountId, () => {
                    this.tree.open_node(parentSubId, () => {
                        this.tree.select_node(nodeId);
                        if (particulars) {
                            this.displayJournalDetails(id, particulars);
                        }
                    });
                });
                break;
        }
    }

    handleTreeNodeSelection(data) {
        const { node } = data;
        const { id: nodeId, original } = node;
        const nodeType = original?.type;

        this.hideAllSections();

        switch (nodeType) {
            case "root":
                this.renderAccountList(this.ledgerData.accounts);
                this.showSection("account");
                break;
            case "account":
                this.handleAccountNodeSelection(nodeId);
                break;
            case "subaccount":
                this.handleSubAccountNodeSelection(node);
                break;
            case "journal":
                this.handleJournalNodeSelection(node);
                break;
        }
    }

    displayJournalDetails(journalId, particulars) {
        setTimeout(() => {
            this.showInfo(
                `Journal selected: ${particulars} (ID: ${journalId})`,
            );
        }, 200);

        this.showSection("journal");
    }

    handleJournalSelection(journalId, particulars) {
        this.displayJournalDetails(journalId, particulars);
    }

    handleAccountNodeSelection(nodeId) {
        const accountHeadId = nodeId.replace("account_", "");
        this.currentAccountId = accountHeadId;

        const account = this.ledgerData.accounts.find(
            (acc) => acc.accountHeadId == accountHeadId,
        );

        if (!this.tree.is_open(nodeId)) {
            this.tree.open_node(nodeId);
        }

        this.loadSubAccounts(accountHeadId);
    }

    handleSubAccountNodeSelection(node) {
        const accountId = node.original.parent?.replace("account_", "");
        const subAccountId = node.id.replace("subaccount_", "");

        if (!accountId || !subAccountId) return;

        const accountDetails = this.ledgerData.details["account_" + accountId];
        const subAccounts = accountDetails?.subAccounts || [];

        const subAccount = subAccounts.find(
            (sub) => sub.subAccountHeadId == subAccountId,
        );

        if (!this.tree.is_open(node.id)) {
            this.tree.open_node(node.id);
        }

        this.renderJournalList(subAccount.journals || []);
    }

    handleJournalNodeSelection(node) {
        const journalId = node.id.replace("journal_", "");
        const particulars = node.text;

        const subAccountId = node.parent.replace("subaccount_", "");
        const subAccountNode = this.tree.get_node(node.parent);
        const accountId = subAccountNode.parent.replace("account_", "");

        if (!accountId || !subAccountId) return;

        const subAccounts =
            this.ledgerData.details["account_" + accountId]?.subAccounts || [];

        const subAccount = subAccounts.find(
            (sub) => sub.subAccountHeadId == subAccountId,
        );

        if (!subAccount) return;

        this.renderJournalList(subAccount.journals || []);

        this.selectedJournalId = journalId;
        this.selectedJournalParticulars = particulars;

        this.showSection("journal");
    }

    selectAccountHead(accountHeadId) {
        this.currentAccountId = accountHeadId;
        const nodeId = `account_${accountHeadId}`;
        this.loadSubAccounts(accountHeadId);

        if (this.tree && this.tree.get_node) {
            const node = this.tree.get_node(nodeId);
            if (node && node !== false) {
                this.tree.deselect_all();

                $("#ledger-tree").off("select_node.jstree");

                if (!this.tree.is_open(nodeId)) {
                    this.tree.open_node(nodeId, () => {
                        this.tree.select_node(nodeId);
                        this.bindEvents();
                    });
                } else {
                    this.tree.select_node(nodeId);
                    this.bindEvents();
                }
            }
        }
    }

    loadSubAccounts(accountHeadId) {
        if (!this.ledgerData) return;
        const accountDetails =
            this.ledgerData.details["account_" + accountHeadId];
        const subAccounts = accountDetails?.subAccounts || [];

        this.renderSubAccountList(subAccounts);
    }

    loadJournals(accountId, subAccountId) {
        if (!this.ledgerData) return;
        const accountDetails = this.ledgerData.details["account_" + accountId];
        if (accountDetails?.subAccounts) {
            const subAccount = accountDetails.subAccounts.find(
                (sub) => sub.subAccountHeadId == subAccountId,
            );
            this.renderJournalList(subAccount?.journals || []);
        }
    }

    loadAccountTypes() {
        if (this.accountTypes) {
            this.populateAccountTypeSelect(this.accountTypes);
            return;
        }

        $.ajax({
            url: "/get-account-types",
            method: "GET",
            success: (data) => {
                if (Array.isArray(data)) {
                    this.populateAccountTypeSelect(data);
                }
            },
            error: () => {
                this.showError("Failed to load account types");
            },
        });
    }

    resetAccountHeadForm() {
        const $form = $("#accountHeadModal form");

        $form[0].reset();

        const $accountType = $("#accountType");
        const $type = $("#type");

        if ($accountType.data("selectpicker")) {
            $accountType.selectpicker("val", "");
        }
        if ($type.data("selectpicker")) {
            $type.selectpicker("val", "");
        }

        $(".error-text").text("");
    }

    resetSubAccountHeadForm() {
        const $form = $("#subAccountHeadModal form");

        $form[0].reset();

        $(".error-text").text("");
    }

    populateAccountHeadSelectFromLocalData() {
        const $select = $("#subAccountHeadModal #accountHead");

        if (!this.ledgerData || !Array.isArray(this.ledgerData.accounts)) {
            this.showError("Account data not loaded yet. Please wait.");
            return;
        }

        const currentId = this.currentAccountId;

        if ($select.data("selectpicker")) {
            $select.selectpicker("destroy");
        }

        $select.empty().append('<option value="">Select Account Head</option>');

        this.ledgerData.accounts.forEach((account) => {
            $select.append(
                `<option value="${account.accountHeadId}">${account.accountHeadName}</option>`,
            );
        });

        $select.selectpicker(); // initialize again

        // ✅ Set the value and refresh
        if (currentId) {
            $select.val(currentId); // set value
            $select.selectpicker("refresh"); // refresh dropdown
        }
    }

    saveAccountHead() {
        const formData = this.getAccountHeadFormData();
        if (!this.validateAccountHeadForm(formData)) return;

        $.ajax({
            url: "/accounting/account-head",
            method: "POST",
            data: formData,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: (response) => {
                this.showSuccess(response.message);
                $("#accountHeadModal").modal("hide");
                const newNodeId = "account_" + response.accountHeadId;
                this.refreshData(newNodeId);
            },
            error: (xhr) => {
                this.handleFormErrors(xhr);
            },
        });
    }

    saveSubAccountHead(e) {
        const formData = this.getSubAccountFormData();
        if (!this.validateSubAccountForm(formData)) return;

        $.ajax({
            url: "/accounting/sub-account-head",
            method: "POST",
            data: formData,
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: (response) => {
                this.showSuccess(response.message);
                $("#subAccountHeadModal").modal("hide");
                const newNodeId = "subaccount_" + response.newSubAccountHeadId;
                this.refreshData(newNodeId);
            },
            error: (xhr) => {
                this.handleSubAccountFormErrors(xhr);
            },
        });
    }

    renderAccountList(accounts) {
        const $accountList = $("#accountList");
        $accountList.empty();

        accounts.forEach((account) => {
            const accountItem = this.createAccountListItem(account);
            $accountList.append(accountItem);
        });

        $accountList.append(this.createAddAccountButton());
    }

    renderSubAccountList(subAccounts) {
        const $subAccountList = $("#subAccountList");
        $subAccountList.empty();

        if (subAccounts.length > 0) {
            subAccounts.forEach((sub) => {
                const subItem = this.createSubAccountListItem(sub);
                $subAccountList.append(subItem);
            });
        } else {
            $subAccountList.html(
                '<div class="text-center p-3 text-muted">No Sub Accounts Found</div>',
            );
        }

        $subAccountList.append(this.createAddSubAccountButton());

        this.showSection("sub_account");
    }

    renderJournalList(journals) {
        const $journalList = $("#journalList");
        $journalList.empty();

        if (journals.length > 0) {
            journals.forEach((journal) => {
                const journalItem = this.createJournalListItem(journal);
                $journalList.append(journalItem);
            });
        } else {
            $journalList.html(
                '<div class="text-center p-3 text-muted">No Journals Found</div>',
            );
        }

        this.showSection("journal");
    }

    createAccountListItem(account) {
        return `
            <a href="javascript:void(0);" 
               class="list-group-item list-group-item-action d-flex justify-content-between account-head-item"
               data-id="${account.accountHeadId}">
                <div class="li-wrapper d-flex justify-content-start align-items-center">
                    <div class="avatar avatar-sm me-4">
                        <span class="avatar-initial rounded-circle bg-label-warning">
                            <i class="ti ti-folder"></i>
                        </span>
                    </div>
                    <div class="list-content">
                        <h6 class="mb-1">${account.accountHeadName}</h6>
                        <small class="text-muted">#${
                            account.accountHeadId
                        }</small>
                    </div>
                </div>
                <div class="li-wrapper d-flex justify-content-start align-items-center">
                    <div class="list-content d-flex flex-column">
                        <small class="mb-1">Debit: ${this.formatCurrency(
                            account.totalDebit,
                        )} SAR</small>
                        <small class="mb-1">Credit: ${this.formatCurrency(
                            account.totalCredit,
                        )} SAR</small>
                        <small class="text-muted">${account.type}</small>
                    </div>
                </div>
            </a>
        `;
    }

    createSubAccountListItem(subAccount) {
        return `
            <a href="javascript:void(0);" 
                class="list-group-item list-group-item-action d-flex justify-content-between sub-account-head-item"
                data-id="${subAccount.accountHeadId}" 
                data-sub-id="${subAccount.subAccountHeadId}">
                <div class="li-wrapper d-flex justify-content-start align-items-center">
                    <div class="avatar avatar-sm me-4">
                        <span class="avatar-initial rounded-circle bg-label-info">
                            <i class="ti ti-folder"></i>
                        </span>
                    </div>
                    <div class="list-content">
                        <h6 class="mb-1">${subAccount.subAccountHeadName}</h6>
                        <small class="text-muted">#${subAccount.subAccountHeadId}</small>
                    </div>
                </div>
            </a>
        `;
    }

    createJournalListItem(journal) {
        return `
            <a href="javascript:void(0);" 
               class="list-group-item list-group-item-action d-flex justify-content-between journal-item"
               data-journal-id="${journal.accountJournalId}"
               data-account-id="${journal.accountHeadId}"
               data-sub-id="${journal.subAccountHeadId}">
                <div class="li-wrapper d-flex justify-content-start align-items-center">
                    <div class="avatar avatar-sm me-4">
                        <span class="avatar-initial rounded-circle bg-label-success">
                            <i class="ti ti-file-text"></i>
                        </span>
                    </div>
                    <div class="list-content">
                        <h6 class="mb-1">${journal.particulars}</h6>
                        <small class="text-muted">#${journal.accountJournalId}</small>
                    </div>
                </div>
            </a>
        `;
    }

    createAddAccountButton() {
        return `
            <a href="javascript:void(0);"
               class="list-group-item list-group-item-action d-flex justify-content-between"
               data-bs-toggle="modal" data-bs-target="#accountHeadModal" id="AccountHeadModalBtn">
                <div class="li-wrapper d-flex justify-content-start align-items-center">
                    <div class="avatar avatar-sm me-4">
                        <span class="avatar-initial rounded-circle bg-label-dark">
                            <i class="ti ti-circle-plus"></i>
                        </span>
                    </div>
                    <div class="list-content">
                        <h6 class="mb-1">Add Account</h6>
                    </div>
                </div>
            </a>
        `;
    }

    createAddSubAccountButton() {
        return `
            <a href="javascript:void(0);"
               class="list-group-item list-group-item-action d-flex justify-content-between"
               data-bs-toggle="modal" data-bs-target="#subAccountHeadModal" 
               id="subAccountHeadModalBtn">
                <div class="li-wrapper d-flex justify-content-start align-items-center">
                    <div class="avatar avatar-sm me-4">
                        <span class="avatar-initial rounded-circle bg-label-dark">
                            <i class="ti ti-circle-plus"></i>
                        </span>
                    </div>
                    <div class="list-content">
                        <h6 class="mb-1">Add Sub Account</h6>
                    </div>
                </div>
            </a>
        `;
    }

    hideAllSections() {
        $("#account_section").hide();
        $("#sub_account_section").hide();
        $("#journal_section").hide();
    }

    showSection(sectionType) {
        this.hideAllSections();

        $("#account_section").toggle(sectionType === "account");
        $("#sub_account_section").toggle(sectionType === "sub_account");
        $("#journal_section").toggle(sectionType === "journal");
    }

    formatCurrency(amount) {
        return parseFloat(amount || 0).toLocaleString("en-IN");
    }

    getAccountHeadFormData() {
        return {
            accountTypeId: $("#accountType").val(),
            accountHeadCode: $("#accountHeadCode").val(),
            accountHeadName: $("#accountHead").val(),
            type: $("#type").val(),
            suggestedDescription: $("#accountHeadDesc").val(),
        };
    }

    getSubAccountFormData() {
        return {
            accountHeadId: $("#subAccountHeadModal #accountHead").val(),
            subAccountHeadCode: $("#subAccountCode").val(),
            subAccountHeadName: $("#subAccountHead").val(),
            type:
                $('input[name="inlineRadioOptions"]:checked').val() !== "none"
                    ? $('input[name="inlineRadioOptions"]:checked').val()
                    : null,
            referenceId:
                $('input[name="inlineRadioOptions"]:checked').val() !== "none"
                    ? $("#radio_select").val()
                    : null,
        };
    }

    validateAccountHeadForm(data) {
        $(".error-text").text("");

        let isValid = true;

        if (!data.accountTypeId) {
            $(".accountType_error").text("Account type is required");
            isValid = false;
        }

        if (!data.accountHeadName) {
            $(".accountHead_error").text("Account head name is required");
            isValid = false;
        }

        return isValid;
    }

    validateSubAccountForm(data) {
        $(".error-text").text("");

        let isValid = true;

        if (!data.accountHeadId) {
            $(".accountHead_error").text("Account head is required");
            isValid = false;
        }

        if (!data.subAccountHeadName) {
            $(".subAccountHead_error").text(
                "Sub account head name is required",
            );
            isValid = false;
        }

        return isValid;
    }

    populateAccountTypeSelect(types) {
        const $select = $("#accountType");

        if ($select.data("selectpicker")) {
            $select.selectpicker("destroy");
        }

        $select.empty();

        $select.append('<option value="">Select Account Type</option>');

        const seen = new Set();
        types.forEach((type) => {
            if (!seen.has(type.accountTypeId)) {
                seen.add(type.accountTypeId);
                $select.append(
                    `<option value="${type.accountTypeId}">${type.accountType}</option>`,
                );
            }
        });

        $select.selectpicker("render");
    }

    handleFormErrors(xhr) {
        if (xhr.status === 422) {
            const errors = xhr.responseJSON?.errors || {};

            Object.keys(errors).forEach((field) => {
                const errorClass =
                    field === "accountHeadName"
                        ? "accountHead_error"
                        : `${field}_error`;
                $(`.${errorClass}`).text(errors[field][0]);
            });
        } else {
            this.showError("Something went wrong. Please try again.");
        }
    }

    handleSubAccountFormErrors(xhr) {
        if (xhr.status === 422) {
            let errors = xhr.responseJSON.errors;
            $(".error-text").text("");

            if (errors.accountHeadId)
                $(".accountHead_error").text(errors.accountHeadId[0]);
            if (errors.subAccountHeadCode)
                $(".card_sub_account_code_error").text(
                    errors.subAccountHeadCode[0],
                );
            if (errors.subAccountHeadName)
                $(".subAccountHead_error").text(errors.subAccountHeadName[0]);
        } else {
            this.showError("Something went wrong. Please try again.");
        }
    }

    refreshData(selectNodeId = null) {
        const selectedBranches = $("#select-branch").val();
        $.ajax({
            url: "/get-ledger-data",
            type: "GET",
            data: {
                clinic_ids: selectedBranches
                    ? Array.isArray(selectedBranches)
                        ? selectedBranches
                        : [selectedBranches]
                    : [],
            },
            success: (response) => {
                if (response.success) {
                    this.ledgerData = response;
                    this.initializeTree(response.tree);
                    this.renderAccountList(response.accounts);

                    if (selectNodeId) {
                        $("#ledger-tree").one("ready.jstree", () => {
                            this.tree.deselect_all();

                            const parentId = this.tree.get_parent(selectNodeId);
                            if (parentId && parentId !== "#") {
                                this.tree.open_node(parentId, () => {
                                    this.tree.select_node(selectNodeId);
                                    const selectedNode =
                                        this.tree.get_node(selectNodeId);
                                    if (selectedNode) {
                                        this.handleTreeNodeSelection({
                                            node: selectedNode,
                                        });
                                    }
                                });
                            } else {
                                this.tree.select_node(selectNodeId);
                                const selectedNode =
                                    this.tree.get_node(selectNodeId);
                                if (selectedNode) {
                                    this.handleTreeNodeSelection({
                                        node: selectedNode,
                                    });
                                }

                                if (selectNodeId.startsWith("subaccount_")) {
                                    const accountId = this.currentAccountId;
                                    const accountNodeId =
                                        "account_" + accountId;

                                    this.tree.open_node(accountNodeId);
                                    this.tree.deselect_all();
                                    this.tree.select_node(accountNodeId);

                                    const accountDetails =
                                        this.ledgerData.details[
                                            "account_" + accountId
                                        ];
                                    const subAccounts =
                                        accountDetails?.subAccounts || [];
                                    this.renderSubAccountList(subAccounts);
                                }
                            }
                        });
                    }
                }
            },
            error: (xhr) => {
                console.error("Error loading ledger data:", xhr.responseText);
                this.showError("Failed to load ledger data.");
            },
        });
    }

    resetForms() {
        $("#accountHeadModal form").trigger("reset");
        $("#subAccountHeadModal form").trigger("reset");
        $(".error-text").text("");
    }

    showSuccess(message) {
        Swal.fire({
            title: "Success!",
            text: message,
            icon: "success",
            customClass: { confirmButton: "btn btn-success" },
            buttonsStyling: false,
        });
    }

    showError(message) {
        Swal.fire({
            title: "Error!",
            text: message,
            icon: "error",
            customClass: { confirmButton: "btn btn-danger" },
            buttonsStyling: false,
        });
    }

    showInfo(message) {
        Swal.fire({
            title: "Info",
            text: message,
            icon: "info",
            customClass: { confirmButton: "btn btn-info" },
            buttonsStyling: false,
        });
    }
}

// Initialize the application when DOM is ready
$(document).ready(() => {
    window.accountLedgerManager = new AccountLedgerManager();
});
