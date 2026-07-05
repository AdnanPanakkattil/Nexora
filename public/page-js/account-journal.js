$(document).ready(function () {
    $("#accounts_main_menu").addClass("active open menu-item-animating");
    $("#account_journal_sub_menu").addClass("active");

    var rangePickr = $(".flatpickr-range");
    var rangePickrInstance = null; // ← declare here so clearDateBtn can access it

    if (rangePickr.length) {
        rangePickrInstance = rangePickr.flatpickr({ // ← assign to the variable
            mode: "range",
            dateFormat: "m/d/Y",
            onClose: function (selectedDates) {
                var startDate = selectedDates[0]
                    ? moment(selectedDates[0]).format("YYYY-MM-DD")
                    : null;
                var endDate = selectedDates[1]
                    ? moment(selectedDates[1]).format("YYYY-MM-DD")
                    : null;
                $(".start_date").val(startDate);
                $(".end_date").val(endDate);

                if (startDate && endDate) {
                    loadJournalEntries(startDate, endDate);
                }
            },
        });
    }

    $("#clearDateBtn").on("click", function () {
        if (rangePickrInstance) {
            rangePickrInstance.clear(); // clears both dates from the picker UI
        }
        $(".start_date").val("");
        $(".end_date").val("");

        // Reload with default month range after clearing
        const defaultStart = moment().startOf("month").format("YYYY-MM-DD");
        const defaultEnd = moment().endOf("month").format("YYYY-MM-DD");
        $(".start_date").val(defaultStart);
        $(".end_date").val(defaultEnd);
        loadJournalEntries(defaultStart, defaultEnd);
    });

    flatpickrTimeFrom = document.querySelector("#flatpickr-time-from");
    flatpickrTimeTo = document.querySelector("#flatpickr-time-to");

    if (flatpickrTimeFrom) {
        flatpickrTimeFrom.flatpickr({
            enableTime: true,
            noCalendar: true,
            dateFormat: "h:i K",
            time_24hr: false,
        });
    }
    if (flatpickrTimeTo) {
        flatpickrTimeTo.flatpickr({
            enableTime: true,
            noCalendar: true,
            dateFormat: "h:i K",
            time_24hr: false,
        });
    }

    const defaultStart = moment().startOf("month").format("YYYY-MM-DD");
    const defaultEnd = moment().endOf("month").format("YYYY-MM-DD");
    $(".start_date").val(defaultStart);
    $(".end_date").val(defaultEnd);
    loadJournalEntries(defaultStart, defaultEnd);
});

function loadJournalEntries(startDate, endDate, page = 1) {
    $.ajax({
        url: "/account-journal",
        method: "GET",
        data: {
            start_date: startDate,
            end_date: endDate,
            page: page,
        },
        success: function (response) {
            let html = "";

            response.data.forEach((entries) => {
                let debitEntries = entries.filter((e) => e.debit > 0);
                let creditEntries = entries.filter((e) => e.credit > 0);
                let narration = entries[0].narration ?? "Journal Entry";

                debitEntries.forEach((entry, index) => {
                    html += `
                        <tr>
                            <td>${index === 0 ? entry.dateOfPayment : ""}</td>
                            <td>${
                                entry.display_account_name ?? entry.account_head?.accountHeadName ?? "N/A"
                            }</td>
                            <td>${parseFloat(entry.debit).toFixed(2)}</td>
                            <td></td>
                        </tr>
                    `;
                });

                creditEntries.forEach((entry) => {
                    html += `
                        <tr>
                            <td></td>
                            <td class="ps-12">${
                                entry.display_account_name ?? entry.account_head?.accountHeadName ?? "N/A"
                            }</td>
                            <td></td>
                            <td>${parseFloat(entry.credit).toFixed(2)}</td>
                        </tr>
                    `;
                });

                html += `
                    <tr>
                        <td colspan="5" class="table-secondary fst-italic" style="padding-left: 20px;">
                            ${narration}
                        </td>
                    </tr>
                `;
            });

            $("#journalBody").html(html);

            // Pagination links
            let paginationHtml = "";
            if (response.last_page > 1) {
                for (let i = 1; i <= response.last_page; i++) {
                    paginationHtml += `
            <li class="page-item ${i == response.current_page ? "active" : ""}">
                <a class="page-link" href="#">${i}</a>
            </li>`;
                }
                $("#pagination").html(
                    `<ul class="pagination">${paginationHtml}</ul>`,
                );
                $("#pagination .page-link").click(function (e) {
                    e.preventDefault();
                    let selectedPage = parseInt($(this).text());
                    loadJournalEntries(startDate, endDate, selectedPage);
                });
            } else {
                $("#pagination").empty();
            }
        },
        error: function () {
            alert("Failed to load journal entries.");
        },
    });
}