'use strict';

/**
 * Chart of Accounts — DB-backed UI behaviour.
 * Tree navigation, search, clinic switching, and an Add/Edit modal that
 * persists to the chart_of_accounts backend.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Highlight the active sidebar item (same pattern as account-head.js).
    const accountsMenu = document.getElementById('accounts_main_menu');
    if (accountsMenu) accountsMenu.classList.add('active', 'open', 'menu-item-animating');
    const coaSubMenu = document.getElementById('chart_of_accounts_sub_menu');
    if (coaSubMenu) coaSubMenu.classList.add('active');

    const labels = window.coaLabels || {};
    const config = window.coaConfig || { routes: {} };
    const isAr = config.locale === 'ar';
    const tree = document.getElementById('coaTree');
    const treeEmpty = document.getElementById('coaTreeEmpty');
    const searchInput = document.getElementById('coaSearch');

    const detailName = document.getElementById('coaDetailName');
    const detailCode = document.getElementById('coaDetailCode');
    const detailNature = document.getElementById('coaDetailNature');
    const detailAmount = document.getElementById('coaDetailAmount');
    const rowsWrap = document.getElementById('coaRows');

    const modalEl = document.getElementById('accountModal');
    const modal = modalEl ? new bootstrap.Modal(modalEl) : null;
    const modalTitle = document.getElementById('accountModalTitle');
    const codeInput = document.getElementById('coaCode');
    const nameInput = document.getElementById('coaName');
    const nameArInput = document.getElementById('coaNameAr');
    const accountTypeSelect = document.getElementById('coaAccountType');
    const mainAccountWrap = document.getElementById('coaMainAccountWrap');
    const saveBtn = document.getElementById('coaSaveBtn');

    // Custom "Main Account" searchable dropdown elements.
    const maSelect = document.getElementById('coaMainAccountSelect');
    const maToggle = document.getElementById('coaMainAccountToggle');
    const maMenu = document.getElementById('coaMainAccountMenu');
    const maSearch = document.getElementById('coaMainAccountSearch');
    const maList = document.getElementById('coaMainAccountList');
    const maEmpty = document.getElementById('coaMainAccountEmpty');
    const maValue = document.getElementById('coaMainAccountValue');
    const maHidden = document.getElementById('coaMainAccount');

    // The head node currently shown in the right panel (default parent for "Add").
    let currentHead = null;
    // Modal state: 'add' | 'edit', and the id of the account being edited.
    let modalMode = 'add';
    let editingId = null;

    if (!tree) return;

    /* ---------- helpers ---------- */

    function natureClass(nature) {
        return nature === 'Credit' ? 'bg-label-warning' : 'bg-label-info';
    }

    function natureLabel(nature) {
        return nature === 'Credit' ? (labels.credit || 'Credit') : (labels.debit || 'Debit');
    }

    function nodeData(link) {
        return {
            id: link.getAttribute('data-id'),
            code: link.getAttribute('data-code'),
            name: link.getAttribute('data-name'),
            nameAr: link.getAttribute('data-name-ar'),
            type: link.getAttribute('data-type'),
            nature: link.getAttribute('data-nature'),
            isGroup: link.getAttribute('data-group') === '1',
        };
    }

    // Direct child links of a node's <li> (skips deeper descendants).
    function directChildLinks(li) {
        const sub = li.querySelector(':scope > ul.coa-tree-sub');
        if (!sub) return [];
        return Array.from(sub.querySelectorAll(':scope > li.coa-tree-item > .coa-tree-link'));
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str == null ? '' : str;
        return div.innerHTML;
    }

    // Primary label follows the app locale (Arabic name when Arabic, else English);
    // the other language is shown as the secondary subtitle. data.name = English.
    function displayName(data) {
        return isAr && data.nameAr ? data.nameAr : data.name;
    }

    function secondaryName(data) {
        return isAr ? data.name : (data.nameAr || '');
    }

    // Placeholder balance — the chart is not wired to the ledger yet, so every
    // account reads 0.00. When postings are linked, only accountAmount() changes.
    function accountAmount(data) {
        return 0;
    }

    function formatAmount(value) {
        return Number(value || 0).toFixed(2);
    }

    // Right-aligned amount + nature stack shared by rows and the leaf self-line.
    function amountBlockHtml(data) {
        return '<div class="coa-row-amount">' +
            '<span class="coa-row-amount-value">' + formatAmount(accountAmount(data)) + '</span>' +
            '<span class="coa-row-nature ' + (data.nature === 'Credit' ? 'text-warning' : 'text-info') + '">' +
                natureLabel(data.nature) +
            '</span>' +
        '</div>';
    }

    /* ---------- right-hand detail panel ---------- */

    function renderDetail(link) {
        const data = nodeData(link);
        currentHead = data;
        detailName.textContent = displayName(data);
        detailCode.textContent = '#' + data.code;
        detailNature.textContent = natureLabel(data.nature);
        detailNature.className = 'badge coa-nature-badge ' + natureClass(data.nature);
        if (detailAmount) detailAmount.textContent = formatAmount(accountAmount(data));

        // "Add Account" only makes sense under a range/band account; single fixed-code
        // accounts (e.g. 111999, 123000) cannot hold sub-accounts.
        const canAddChild = (data.code || '').includes('-');
        const addAccountBtn = document.getElementById('coaAddAccount');
        if (addAccountBtn) addAccountBtn.style.display = canAddChild ? '' : 'none';

        const li = link.closest('li.coa-tree-item');
        const children = directChildLinks(li);
        rowsWrap.innerHTML = '';

        // A detail/leaf account shows its own amount line (like Daftra) instead of
        // the confusing "No accounts under this head" message.
        if (!children.length) {
            rowsWrap.appendChild(buildSelfRow(data));
            return;
        }

        children.forEach(function (childLink) {
            rowsWrap.appendChild(buildRow(nodeData(childLink), data));
        });
    }

    // Read-only single line for a leaf account (no actions, no drill-in).
    function buildSelfRow(data) {
        const row = document.createElement('div');
        row.className = 'coa-row coa-row--self';
        row.innerHTML =
            '<div class="coa-row-icon"><i class="ti ti-file-text"></i></div>' +
            '<div class="coa-row-main">' +
                '<div class="coa-row-name">' + escapeHtml(displayName(data)) + '</div>' +
                '<div class="coa-row-meta">' +
                    '<span class="coa-row-code">#' + escapeHtml(data.code) + '</span>' +
                    '<span class="coa-row-ar" dir="' + (isAr ? 'ltr' : 'rtl') + '">' + escapeHtml(secondaryName(data)) + '</span>' +
                    '<span class="badge bg-label-secondary coa-row-statement">' + escapeHtml(data.type) + '</span>' +
                '</div>' +
            '</div>' +
            amountBlockHtml(data);
        return row;
    }

    function buildRow(data, parent) {
        const row = document.createElement('div');
        row.className = 'coa-row';
        row.innerHTML =
            '<div class="coa-row-icon"><i class="ti ti-folder"></i></div>' +
            '<div class="coa-row-main">' +
                '<div class="coa-row-name">' + escapeHtml(displayName(data)) + '</div>' +
                '<div class="coa-row-meta">' +
                    '<span class="coa-row-code">#' + escapeHtml(data.code) + '</span>' +
                    '<span class="coa-row-ar" dir="' + (isAr ? 'ltr' : 'rtl') + '">' + escapeHtml(secondaryName(data)) + '</span>' +
                    '<span class="badge bg-label-secondary coa-row-statement">' + escapeHtml(data.type) + '</span>' +
                '</div>' +
            '</div>' +
            amountBlockHtml(data) +
            '<div class="dropdown coa-row-actions">' +
                '<button class="btn btn-sm btn-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false">' +
                    '<i class="ti ti-dots-vertical"></i>' +
                '</button>' +
                '<ul class="dropdown-menu dropdown-menu-end">' +
                    '<li><a class="dropdown-item coa-edit" href="javascript:void(0);">' +
                        '<i class="ti ti-pencil me-1"></i>' + (labels.edit || 'Edit') + '</a></li>' +
                    '<li><a class="dropdown-item text-danger coa-delete" href="javascript:void(0);">' +
                        '<i class="ti ti-trash me-1"></i>' + (labels.delete || 'Delete') + '</a></li>' +
                '</ul>' +
            '</div>';

        row.querySelector('.coa-edit').addEventListener('click', function () {
            openModal('edit', data, parent);
        });
        row.querySelector('.coa-delete').addEventListener('click', function () {
            deleteAccount(data);
        });

        // Clicking the row body drills into that account (mirrors the tree).
        // Ignore clicks on the ⋮ actions so Edit/Delete keep working.
        row.addEventListener('click', function (e) {
            if (e.target.closest('.coa-row-actions')) return;
            const match = tree.querySelector('.coa-tree-link[data-id="' + data.id + '"]');
            if (match) selectTreeLink(match);
        });
        return row;
    }

    /* ---------- custom Main Account dropdown ---------- */

    function setMainAccount(id) {
        if (!maHidden) return;
        let label = labels.pleaseSelect || 'Please Select';
        if (maList) {
            maList.querySelectorAll('.coa-select-option').forEach(function (opt) {
                const match = opt.getAttribute('data-value') === String(id);
                opt.classList.toggle('selected', match);
                if (match) label = opt.getAttribute('data-label') || opt.textContent.trim();
            });
        }
        maHidden.value = id || '';
        if (maValue) maValue.textContent = label;
    }

    function openMainMenu() {
        if (!maMenu) return;
        maMenu.hidden = false;
        maSelect.classList.add('open');
        if (maSearch) { maSearch.value = ''; filterMainOptions(''); maSearch.focus(); }
    }

    function closeMainMenu() {
        if (!maMenu) return;
        maMenu.hidden = true;
        maSelect.classList.remove('open');
    }

    function filterMainOptions(term) {
        if (!maList) return;
        const needle = term.trim().toLowerCase();
        let any = false;
        maList.querySelectorAll('.coa-select-option').forEach(function (opt) {
            const show = opt.getAttribute('data-label').toLowerCase().indexOf(needle) !== -1;
            opt.hidden = !show;
            if (show) any = true;
        });
        if (maEmpty) maEmpty.hidden = any;
    }

    if (maToggle) {
        maToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (maMenu.hidden) openMainMenu(); else closeMainMenu();
        });
    }
    if (maSearch) {
        maSearch.addEventListener('input', function () { filterMainOptions(this.value); });
        maSearch.addEventListener('click', function (e) { e.stopPropagation(); });
    }
    if (maList) {
        maList.addEventListener('click', function (e) {
            const opt = e.target.closest('.coa-select-option');
            if (!opt) return;
            setMainAccount(opt.getAttribute('data-value'));
            closeMainMenu();
            // On add, suggest the next free code inside the chosen parent's band.
            if (modalMode === 'add') suggestNextCode(opt.getAttribute('data-value'));
        });
    }
    document.addEventListener('click', function (e) {
        if (maSelect && !maSelect.contains(e.target)) closeMainMenu();
    });

    /* ---------- next-code suggestion ---------- */

    function suggestNextCode(parentId) {
        if (!parentId || !config.routes.nextCode) return;
        fetch(config.routes.nextCode + '?parentId=' + encodeURIComponent(parentId), {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
            .then(function (r) { return r.json(); })
            .then(function (body) {
                // Response shape: { status, status_code, message, data: { code, allowed, full } }.
                // Empty code = single-code parent (not allowed) or band full — leave blank.
                var d = (body && body.data) ? body.data : {};
                if (codeInput) codeInput.value = d.code || '';
            })
            .catch(function () { /* suggestion is best-effort */ });
    }

    /* ---------- modal ---------- */

    function applyAccountType() {
        if (!accountTypeSelect || !mainAccountWrap) return;
        // A "Main Account" has no parent, so hide the Main Account picker for it.
        mainAccountWrap.style.display = accountTypeSelect.value === 'Main-Account' ? 'none' : '';
    }

    function setNature(nature) {
        const credit = document.getElementById('coaTypeCredit');
        const debit = document.getElementById('coaTypeDebit');
        if (nature === 'Credit') { if (credit) credit.checked = true; }
        else { if (debit) debit.checked = true; }
    }

    function getNature() {
        const credit = document.getElementById('coaTypeCredit');
        return credit && credit.checked ? 'Credit' : 'Debit';
    }

    function openModal(mode, data, parent) {
        if (!modal) return;
        modalMode = mode;
        editingId = mode === 'edit' ? (data.id || null) : null;
        if (accountTypeSelect) accountTypeSelect.value = 'Sub-Account';

        if (mode === 'edit') {
            modalTitle.textContent = labels.editAccount || 'Edit Account';
            codeInput.value = data.code || '';
            nameInput.value = data.name || '';
            if (nameArInput) nameArInput.value = data.nameAr || '';
            setNature(data.nature || 'Debit');
            setMainAccount(parent ? parent.id : (currentHead ? currentHead.id : ''));
        } else {
            modalTitle.textContent = labels.addAccount || 'Add Account';
            codeInput.value = '';
            nameInput.value = '';
            if (nameArInput) nameArInput.value = '';
            setNature('Debit');
            const parentId = currentHead ? currentHead.id : '';
            setMainAccount(parentId);
            if (parentId) suggestNextCode(parentId);
        }
        applyAccountType();
        modal.show();
    }

    if (accountTypeSelect) accountTypeSelect.addEventListener('change', applyAccountType);

    // Reset the dropdown menu state whenever the modal closes.
    if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', closeMainMenu);
    }

    const addBtn = document.getElementById('coaAddAccount');
    if (addBtn) addBtn.addEventListener('click', function () { openModal('add', {}, null); });

    /* ---------- persistence ---------- */

    function saveAccount() {
        const isMain = accountTypeSelect && accountTypeSelect.value === 'Main-Account';
        const payload = {
            code: codeInput.value.trim(),
            name_en: nameInput.value.trim(),
            name_ar: nameArInput ? nameArInput.value.trim() : '',
            nature: getNature(),
            parentId: isMain ? '' : (maHidden ? maHidden.value : ''),
        };

        let url, method;
        if (modalMode === 'edit' && editingId) {
            url = config.routes.update + editingId;
            method = 'PUT';
        } else {
            url = config.routes.store;
            method = 'POST';
        }

        if (saveBtn) saveBtn.disabled = true;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': config.csrf,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(payload),
        })
            .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
            .then(function (res) {
                var body = res.body || {};
                // Success = repository status true with 200. Business failures come back with
                // status false + a message; Form Request validation errors come back as 422 + errors.
                if (res.ok && body.status === true && body.status_code === 200) {
                    reloadKeepingSelection();
                } else {
                    const msg = body.message ||
                        (body.errors ? Object.values(body.errors)[0][0] : (labels.saveError || 'Could not save.'));
                    alert(msg);
                    if (saveBtn) saveBtn.disabled = false;
                }
            })
            .catch(function () {
                alert(labels.saveError || 'Could not save.');
                if (saveBtn) saveBtn.disabled = false;
            });
    }

    function deleteAccount(data) {
        if (!data || !data.id) return;
        if (!window.confirm(labels.confirmDelete || 'Delete this account?')) return;

        fetch(config.routes.destroy + data.id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': config.csrf,
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
            .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
            .then(function (res) {
                var body = res.body || {};
                if (res.ok && body.status === true && body.status_code === 200) {
                    reloadKeepingSelection();
                } else {
                    alert(body.message || (labels.saveError || 'Could not delete.'));
                }
            })
            .catch(function () { alert(labels.saveError || 'Could not delete.'); });
    }

    if (saveBtn) saveBtn.addEventListener('click', saveAccount);

    /* ---------- tree interaction ---------- */

    function toggleNode(li, forceOpen) {
        const link = li.querySelector(':scope > .coa-tree-link');
        const sub = li.querySelector(':scope > ul.coa-tree-sub');
        const chevron = link ? link.querySelector('.coa-toggle') : null;
        if (!sub) return;
        const open = typeof forceOpen === 'boolean' ? forceOpen : sub.hidden;
        sub.hidden = !open;
        if (chevron) chevron.classList.toggle('is-open', open);
    }

    // Select a tree node: mark active, render its detail, expand it, reveal it.
    // Shared by the left tree and the clickable rows in the right panel.
    function selectTreeLink(link) {
        if (!link) return;
        const li = link.closest('li.coa-tree-item');
        tree.querySelectorAll('.coa-tree-link.active').forEach(function (el) {
            el.classList.remove('active');
        });
        link.classList.add('active');
        renderDetail(link);
        if (li.querySelector(':scope > ul.coa-tree-sub')) toggleNode(li, true);
        link.scrollIntoView({ block: 'nearest' });
    }

    // Open every ancestor branch so a node is visible, then select it.
    function revealAndSelect(id) {
        const link = tree.querySelector('.coa-tree-link[data-id="' + id + '"]');
        if (!link) return false;

        let sub = link.closest('li.coa-tree-item');
        sub = sub ? sub.parentElement : null;
        while (sub && sub.classList && sub.classList.contains('coa-tree-sub')) {
            sub.hidden = false;
            const parentLi = sub.closest('li.coa-tree-item');
            if (!parentLi) break;
            const chevron = parentLi.querySelector(':scope > .coa-tree-link .coa-toggle');
            if (chevron) chevron.classList.add('is-open');
            sub = parentLi.parentElement;
        }

        selectTreeLink(link);
        return true;
    }

    // Remember the currently-viewed account across a reload so edits don't bounce
    // the user back to the top of the tree.
    function reloadKeepingSelection() {
        try {
            if (currentHead && currentHead.id) {
                sessionStorage.setItem('coaSelectedId', currentHead.id);
            }
        } catch (e) { /* sessionStorage may be unavailable */ }
        window.location.reload();
    }

    tree.addEventListener('click', function (e) {
        const link = e.target.closest('.coa-tree-link');
        if (!link || !tree.contains(link)) return;
        const li = link.closest('li.coa-tree-item');

        // Chevron click only toggles; elsewhere on the row selects + toggles.
        if (e.target.closest('.coa-toggle') && !e.target.classList.contains('coa-toggle--empty')) {
            toggleNode(li);
            return;
        }

        selectTreeLink(link);
    });

    /* ---------- search ---------- */

    searchInput && searchInput.addEventListener('input', function () {
        const term = this.value.trim().toLowerCase();
        const items = tree.querySelectorAll('li.coa-tree-item');

        if (!term) {
            items.forEach(function (li) {
                li.hidden = false;
                const sub = li.querySelector(':scope > ul.coa-tree-sub');
                if (sub) { sub.hidden = true; }
                const chevron = li.querySelector(':scope > .coa-tree-link .coa-toggle');
                if (chevron) chevron.classList.remove('is-open');
            });
            if (treeEmpty) treeEmpty.hidden = true;
            return;
        }

        let anyMatch = false;
        items.forEach(function (li) {
            const link = li.querySelector(':scope > .coa-tree-link');
            const hay = (link.getAttribute('data-name') + ' ' +
                         link.getAttribute('data-name-ar') + ' ' +
                         link.getAttribute('data-code')).toLowerCase();
            li.dataset.match = hay.indexOf(term) !== -1 ? '1' : '0';
        });

        items.forEach(function (li) {
            const selfMatch = li.dataset.match === '1';
            const descMatch = li.querySelector('li.coa-tree-item[data-match="1"]') !== null;
            const visible = selfMatch || descMatch;
            li.hidden = !visible;
            if (visible) anyMatch = true;

            const sub = li.querySelector(':scope > ul.coa-tree-sub');
            const chevron = li.querySelector(':scope > .coa-tree-link .coa-toggle');
            if (sub) {
                const expand = descMatch || (selfMatch && term.length > 0);
                sub.hidden = !expand;
                if (chevron) chevron.classList.toggle('is-open', expand);
            }
        });

        if (treeEmpty) treeEmpty.hidden = anyMatch;
    });

    /* ---------- initial state ---------- */

    // Restore the account the user was viewing before a save/edit/delete reload;
    // otherwise select the first top-level node.
    let restoredId = null;
    try {
        restoredId = sessionStorage.getItem('coaSelectedId');
        sessionStorage.removeItem('coaSelectedId');
    } catch (e) { /* sessionStorage may be unavailable */ }

    if (!(restoredId && revealAndSelect(restoredId))) {
        const firstLink = tree.querySelector('.coa-tree-link');
        if (firstLink) {
            firstLink.classList.add('active');
            renderDetail(firstLink);
            const firstLi = firstLink.closest('li.coa-tree-item');
            if (firstLi.querySelector(':scope > ul.coa-tree-sub')) toggleNode(firstLi, true);
        }
    }
});
