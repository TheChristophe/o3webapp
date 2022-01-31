import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfmake.vfs = pdfFonts.pdfMake.vfs;

const legalNoticeHeading = "ACCEPTABLE USE POLICY AND CONDITIONS OF USE"

const legalNotice = `This Acceptable Use Policy and Conditions of Use (“AUP”) defines the rules and conditions that govern your access to and use (including transmission, processing, and storage of data) of the resources and services (“Services”) as granted by the department Data Analytics, Access and Applications (D3A) from the Steinbuch Centre for Computing (SCC) of Karlsruhe Institute of Technology (KIT), located at Hermann-von-Helmholtz-Platz 1, 76344 Eggenstein-Leopoldshafen (the “Provider”) for the purpose of retrieving the ozone data and producing high-quality figures for the ozone assessment.`

const points = [
    "You shall only use the Services in a manner consistent with the purposes and limitations described above; you shall show consideration towards other users including by not causing harm to the Services; you have an obligation to collaborate in the resolution of issues arising from your use of the Services.",
    "You shall only use the Services for lawful purposes and not breach, attempt to breach, nor circumvent administrative or security controls.",
    "You shall respect intellectual property and confidentiality agreements.",
    "You shall protect your access credentials (e.g. passwords, private keys or multi-factor tokens); no intentional sharing is permitted.",
    "You shall keep your registered information correct and up to date.",
    "You shall promptly report known or suspected security breaches, credential compromise, or misuse to the security contact stated below; and report any compromised credentials to the relevant issuing authorities.",
    "Reliance on the Services shall only be to the extent specified by any applicable service level agreements listed below. Use without such agreements is at your own risk.",
    "Your personal data will be processed in accordance with the privacy statements referenced below.",
    "Your use of the Services may be restricted or suspended, for administrative, operational, or security reasons, without prior notice and without compensation.",
    'You shall provide appropriate acknowledgement and citation for your use of the resources/services and the original data as described in "Data policies, references and acknowledgments for the O3as services and original data".',
    "If you violate these rules, you may be liable for the consequences, which may include your account being suspended and a report being made to your home organisation or to law enforcement.",
]

function getBase64Image() {
    return new Promise((resolve, reject) => {
        const svgElement = document.querySelector('.apexcharts-svg');
        var s = new XMLSerializer();
        var str = s.serializeToString(svgElement);
        resolve(str)
       });
}

function addViewbox(str) {
    const lastIndex = str.indexOf("height") + 10;
    const offset = str.substring(lastIndex).indexOf('"');
    const insertAt = offset + lastIndex + 2;

    return str.substring(0, insertAt) + `viewBox="0 0 1000 622" ` + str.substring(insertAt)
}

export async function showPdf(models) {
    const svgAsString = await getBase64Image()
    
      const docDefinition = {
        content: [
          {
            text: 'OCTS Plot from 1960 - 2100',
            fontSize: 26,
          },
          {
            svg: addViewbox(svgAsString),
            width: 500,
          },
          {
              text: 'List of used models:',
              fontSize: 20,
          },
          {
              ul: models
          },
          {
              text: legalNoticeHeading,
              fontSize: 20
          },
          legalNotice,
          {
              ol: points,
          },
        ],
        pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
          return currentNode.text == legalNoticeHeading || currentNode.text == 'List of used models:'
        }
      };
      pdfmake.createPdf(docDefinition).open();
  }

export default function createPdf() {
    
}