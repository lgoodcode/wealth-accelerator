import type { PdfParser, WindowWithPdfJs, InsurancePolicyRow } from '../../types';

const NUM_PAGES = 2;
const STARTING_PAGE = 1;
const STARTING_LINE = 70;
const COLS: (keyof InsurancePolicyRow)[] = [
  'year',
  'net_death_benefit_end_year',
  'age_end_year',
  'premium',
  'net_cash_value_end_year',
];

export const aulInforceParser: PdfParser = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onload = async function () {
      if (!reader.result) {
        return reject('No result from FileReader');
      }

      try {
        const windowWithPdf = window as WindowWithPdfJs;
        const data: InsurancePolicyRow[] = [];
        const pdf = await windowWithPdf.pdfjsLib.getDocument(reader.result).promise;
        const pages = await Promise.all(
          Array.from({ length: NUM_PAGES }).map((_, i) =>
            pdf.getPage(i + STARTING_PAGE).then((page: any) => page.getTextContent())
          )
        );

        for (
          let pageIdx = 0, page = pages[pageIdx];
          pageIdx < pages.length;
          page = pages[++pageIdx]
        ) {
          let finishedPage = false;

          for (let i = STARTING_LINE; i < page.items.length; ) {
            if (finishedPage) {
              break;
            }

            const row: Partial<InsurancePolicyRow> = {
              id: data.length,
              cumulative_net_outlay: 0,
              net_annual_cash_value_increase: 0,
            };

            for (let j = 0, k = i; j < COLS.length && i < page.items.length; j++) {
              if (finishedPage) {
                break;
              }

              const item = page.items[i].str.replace(/,/g, '');
              const val = parseFloat(item);

              row[COLS[j]] = val || 0;

              // Annual outlay is same as premium so we can just set it to the premium value
              if (j === 3) {
                row.annual_net_outlay = row.premium || 0;
              }

              // The PDF is parsed in a weird way, so we need to increment the index by 2 for the first 3 columns
              // and the columnns are not in proper order so the COLS array is used to map the columns to the
              // correct index
              if (j === 0 || j === 2) {
                k += 2;
              } else if (j === 1) {
                k += 5;
              } else if (j === 3) {
                k += 4;
                // End of the row, so increment by 3 to get to the next row
              } else {
                k += 4;
              }

              // Update the main index to the new index
              i = k;

              // If we reached the end of the page, break out of the loop to get to the next page
              if (page.items[i + 1].str.length > 20 && isNaN(page.items[i + 1].str)) {
                finishedPage = true;
                break;
              }
            }

            data.push(row as InsurancePolicyRow);
          }
        }
        resolve(data);
      } catch (error: any) {
        reject(error);
      }
    };
  });
};
