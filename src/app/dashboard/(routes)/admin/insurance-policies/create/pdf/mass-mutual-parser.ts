import type { PdfParser, WindowWithPdfJs, InsurancePolicyRow } from '../../types';

const NUM_PAGES = 2;
const STARTING_PAGE = 1;
const STARTING_LINES = [88, 78, 78];
const COLS: (keyof InsurancePolicyRow)[] = [
  'year',
  'age_end_year',
  'annual_net_outlay',
  'cumulative_net_outlay',
  'net_cash_value_end_year',
  'net_annual_cash_value_increase',
  'net_death_benefit_end_year',
];

export const massMutualParser: PdfParser = async (file) => {
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
          let done = false;

          for (let i = STARTING_LINES[pageIdx]; i < page.items.length; ) {
            if (done) break;

            const row: Partial<InsurancePolicyRow> = {
              id: data.length,
            };

            for (let j = 0; j < COLS.length && i < page.items.length; j++, i += 2) {
              if (done) break;

              row[COLS[j]] = parseFloat(page.items[i].str.replace(/,/g, '')) || 0;

              if (page.items[i + 1].str.length > 20 && isNaN(page.items[i + 1].str)) {
                done = true;
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
