// Coder: To Van Huong - Paul To - Viet Nam 
/*
    Summary idea: 
    - This component is used to display a report of the discrepancy between the data entered in the app and the data in reality.
    - The discrepancy is calculated based on the substraction between the data in the reality and the data entered in the app. 
    - There are several discrepancies that need to be calculated:
        AppData - RealityData
        mGlass - 500ml
        lGlass - 700ml
        glass800 - 800ml
        revenue - remainRevenue
        mGlass + lGlass - glassesOnForceMachine

        Conclusion: ....
 */
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import * as XLSX from 'xlsx'; // Import the XLSX library to read the Excel file
interface AppData { // Define the type of data from the app to display in the report 
    glassesOnApp: {
        mGlass: number;
        lGlass: number;
        glass800: number;
    },
    revenueOnApp: string,
    remainRevenue: string,
    glassesOnForceMachine: number
    initialMoney: string,
    total: string,
    moneyUsed: string,
    note: string
}

interface RealityData { // Define the type of data from the reality to display in the report 
    totalCupsSole: {
        '500ml': number;
        '700ml': number;
        '800ml': number;
    }
}
const ReportModal = ({ closeModal, branchName, appData, realityData, day, monthAndYear }: { closeModal: () => void, branchName: string, appData: AppData, realityData: RealityData, day: number, monthAndYear: string }) => {

    const [staffName, setStaffName] = useState(''); // Store the staff name to display in the report 
    const formatNumber = (number: number): string => { // Convert a number to a string with format 000.000.000
        return new Intl.NumberFormat('de-DE').format(number);
    };
    const parseFormattedNumber = (formattedNumber: string): number => { // Convert a formatted number to a number to calculate the total revenue and note
        return parseInt(formattedNumber.replace(/\./g, ''), 10);
    };

    const discrepancyANumberOfGlasses = { // Caculate the discrepancy between the number of glasses sold in reality and the number of glasses entered in the app (fill "Chenh lech" column, row "Ly M(500ml)", "Ly L(700ml)", "Ly 800ml")
        mGlass: realityData.totalCupsSole['500ml'] - appData.glassesOnApp.mGlass,
        lGlass: realityData.totalCupsSole['700ml'] - appData.glassesOnApp.lGlass,
        glass800: realityData.totalCupsSole['800ml'] - appData.glassesOnApp.glass800,
    }

    const discrepancyMoney = parseFormattedNumber(appData.remainRevenue) - parseFormattedNumber(appData.revenueOnApp); // Calculate the discrepancy between the revenue entered in the app and the revenue in reality (fill "Chenh lech" column, row "Số tiền")
    const totalCupsSoleOnApp = appData.glassesOnApp.mGlass + appData.glassesOnApp.lGlass; // Calculate the total number of glasses sold in the app. Include the number of M and L glasses (except 800ml glasses) (fill "App" column, row "Máy ép")
    const discrepancyANumberOfGlassesOnForceMachine = totalCupsSoleOnApp - appData.glassesOnForceMachine; // Calculate the discrepancy between the number of glasses sold in reality and the number of glasses entered in the app (fill "Chenh lech" column)
    const discrepancyBetweenAppAndReality = discrepancyANumberOfGlasses.mGlass * 15000 + discrepancyANumberOfGlasses.lGlass * (discrepancyANumberOfGlasses.lGlass < 0 ? 10000 : 20000) + discrepancyANumberOfGlasses.glass800 * 10000 - discrepancyMoney // Calculate the discrepancy between the number of glasses sold and the number of glasses sold on the force machine

    const downloadExcel = () => {
        const date = String(day).padStart(2, '0') + '/' + monthAndYear.slice(-2) + "/" + monthAndYear.slice(0, 4); // Format the date to display in the Excel file
        const data = [
            { 'Mục': 'Nhân viên', 'App': staffName },
            { 'Mục': 'Ly M(500ml)', 'App': appData.glassesOnApp.mGlass, 'Thực tế': realityData.totalCupsSole['500ml'], 'Chênh lệch': discrepancyANumberOfGlasses.mGlass },
            { 'Mục': 'Ly L(700ml)', 'App': appData.glassesOnApp.lGlass, 'Thực tế': realityData.totalCupsSole['700ml'], 'Chênh lệch': discrepancyANumberOfGlasses.lGlass },
            { 'Mục': 'Ly 800ml', 'App': appData.glassesOnApp.glass800, 'Thực tế': realityData.totalCupsSole['800ml'], 'Chênh lệch': discrepancyANumberOfGlasses.glass800 },
            { 'Mục': 'Số tiền', 'App': appData.revenueOnApp, 'Thực tế': appData.remainRevenue, 'Chênh lệch': discrepancyMoney },
            { 'Mục': 'Máy ép', 'App': totalCupsSoleOnApp, 'Thực tế': appData.glassesOnForceMachine, 'Chênh lệch': discrepancyANumberOfGlassesOnForceMachine },
            { 'Mục': '' },
            { 'Mục': 'KẾT LUẬN:' },
            { 'Mục': discrepancyANumberOfGlasses.mGlass !== 0 ? 'Bấm ' + (discrepancyANumberOfGlasses.mGlass < 0 ? "DƯ" : "THIẾU") + ' ' + Math.abs(discrepancyANumberOfGlasses.mGlass) + ' ly M' : " ", 'Chênh lệch': discrepancyANumberOfGlasses.mGlass !== 0 ? Math.abs(discrepancyANumberOfGlasses.mGlass) * 15000 + ' VND' : " " },
            { 'Mục': discrepancyANumberOfGlasses.lGlass != 0 ? 'Bấm ' + (discrepancyANumberOfGlasses.lGlass < 0 ? "DƯ" : "THIẾU") + ' ' + Math.abs(discrepancyANumberOfGlasses.lGlass) + ' ly L' : " ", 'Chênh lệch': discrepancyANumberOfGlasses.lGlass !== 0 ? Math.abs(discrepancyANumberOfGlasses.lGlass) * (discrepancyANumberOfGlasses.lGlass < 0 ? 10000 : 20000) + ' VND' : " " },
            { 'Mục': discrepancyANumberOfGlasses.glass800 != 0 ? 'Bấm ' + (discrepancyANumberOfGlasses.glass800 < 0 ? "DƯ" : "THIẾU") + ' ' + Math.abs(discrepancyANumberOfGlasses.glass800) + ' ly 800ml' : " ", 'Chênh lệch': discrepancyANumberOfGlasses.glass800 !== 0 ? Math.abs(discrepancyANumberOfGlasses.glass800) * 10000 + ' VND' : " " },
            { 'Mục': discrepancyBetweenAppAndReality != 0 ? (discrepancyBetweenAppAndReality > 0 ? "Thiếu" : "Dư") + ': ' + Math.abs(discrepancyBetweenAppAndReality) + ' VND' : " " },
            { 'Mục': 'Ngày', 'App': date },
        ]; // Create an array of objects to store the data to export to Excel file
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        const fileName = `BAOCAO_${branchName}_${date}.xlsx`;
        // Create a blob and trigger download  
        XLSX.writeFile(workbook, fileName);
    };


    const divRef = useRef<HTMLDivElement>(null);

    const handleExport = () => {
        if (divRef.current) {
            const date = String(day).padStart(2, '0') + '/' + monthAndYear.slice(-2) + "/" + monthAndYear.slice(0, 4); // Format the date to display in the Excel file
            const element = divRef.current;
            const scale = 1.2; // Increase the scale for better quality

            html2canvas(element, {
                useCORS: true,
                scale: scale,
                width: element.scrollWidth * scale,
                height: element.scrollHeight * scale,
                windowWidth: element.scrollWidth * scale,
                windowHeight: element.scrollHeight * scale,
            })
                .then((canvas) => {
                    // Create a link element to download the image
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL('image/jpeg', 1.0); // 1.0 is for maximum quality
                    const fileName = `BAOCAO_${branchName}_${date}.jpg`;
                    link.download = fileName; // Set the name of the file
                    document.body.appendChild(link); // Append the link to the body
                    link.click(); // Simulate a click on the link
                    document.body.removeChild(link); // Remove the link from the body
                })
                .catch(err => {
                    console.error('Error exporting image:', err);
                });
        }
    };


    return (

        <div className='w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,.8)]'>

            <div className='w-full sm:w-[700px] h-fit bg-white p-4 sm:p-6 border-[2px] border-dashed border-slate-500'>
                <h2 className='text-center font-bold text-2xl text-[#15B392] drop-shadow-md pt-2 pb-6'>BÁO CÁO</h2>
                <p className='pb-4 flex justify-end'><span>Quầy: {branchName}</span></p>
                <div className="mb-6 ">
                    <label htmlFor="username" className="text-black block font-medium">Nhân viên</label>
                    <input
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        type="text"
                        id="staffName"
                        className="outline-none w-[250px] mt-1 p-3 border-[1px] border-solid border-gray-500 rounded-lg"
                    />
                </div>
                <div ref={divRef} className='h-fit'>
                    <p className='flex gap-x-2 mt-6 mb-2'><span>Tên nhân viên:</span><span className="font-bold">{staffName}</span></p>

                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-slate-200">
                            <tr>
                                <th className="border border-gray-300 px-2 sm:px-4 py-2">Mục</th>
                                <th className="border border-gray-300 px-2 sm:px-4 py-2">App</th>
                                <th className="border border-gray-300 px-2 sm:px-4 py-2">Thực tế</th>
                                <th className="border border-gray-300 px-2 sm:px-4 py-2">Chênh lệch</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">Ly M(500ml)</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{appData.glassesOnApp.mGlass}</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{realityData.totalCupsSole['500ml']}</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{discrepancyANumberOfGlasses.mGlass}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">Ly L(700ml)</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{appData.glassesOnApp.lGlass}</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{realityData.totalCupsSole['700ml']}</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{discrepancyANumberOfGlasses.lGlass}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">Ly 800ml</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{appData.glassesOnApp.glass800}</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{realityData.totalCupsSole['800ml']}</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{discrepancyANumberOfGlasses.glass800}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">Số tiền</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{appData.revenueOnApp}</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{appData.remainRevenue}</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{formatNumber(discrepancyMoney)}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">Máy ép</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{totalCupsSoleOnApp}</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{appData.glassesOnForceMachine}</td>
                                <td className="border border-gray-300 px-2 sm:px-4 py-2">{discrepancyANumberOfGlassesOnForceMachine}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='pt-5'>
                        <p className='font-bold'>KẾT LUẬN:</p>
                        <div>
                            {discrepancyANumberOfGlasses.mGlass !== 0 && // When the discrepancy is not equal to 0, it means that there is a discrepancy between the number of glasses type M sold in reality and the number of glasses type M entered in the app 
                                <p>Bấm {discrepancyANumberOfGlasses.mGlass < 0 ? "DƯ" : "THIẾU"} {Math.abs(discrepancyANumberOfGlasses.mGlass)} ly M: <span className='font-bold text-lg text-red-500'>{formatNumber(Math.abs(discrepancyANumberOfGlasses.mGlass) * 15000)}</span> VND</p>}
                            {/* If discrepancyANumberOfGlasses.mGlass is less than 0, it means that the number of glasses type M entered in the app is bigger than in the reality. Therefore, we are going to conclude that it's excess. According for below rows*/}
                            {discrepancyANumberOfGlasses.lGlass !== 0 && <p>Bấm {discrepancyANumberOfGlasses.lGlass < 0 ? "DƯ" : "THIẾU"} {Math.abs(discrepancyANumberOfGlasses.lGlass)} ly L: <span className='font-bold text-lg text-red-500'>{formatNumber(Math.abs(discrepancyANumberOfGlasses.lGlass) * (discrepancyANumberOfGlasses.lGlass < 0 ? 10000 : 20000))}</span> VND</p>}
                            {discrepancyANumberOfGlasses.glass800 !== 0 && <p>Bấm {discrepancyANumberOfGlasses.glass800 < 0 ? "DƯ" : "THIẾU"} {Math.abs(discrepancyANumberOfGlasses.glass800)} ly 800ml: <span className='font-bold text-lg text-red-500'>{formatNumber(Math.abs(discrepancyANumberOfGlasses.glass800) * 10000)}</span> VND</p>}
                            {discrepancyBetweenAppAndReality !== 0 && <p>{discrepancyBetweenAppAndReality > 0 ? "Thiếu: " : "Dư: "} <span className='font-bold text-lg text-red-500'>{formatNumber(Math.abs(discrepancyBetweenAppAndReality))}</span> VND</p>}
                        </div>
                    </div>
                </div>

                <div className='pt-5 pb-2 flex justify-end gap-x-4'>
                    <button onClick={() => { closeModal() }} className='px-6 py-2 rounded-md border-[2px] border-solid border-red-500 text-red-500 text-lg hover:opacity-80 transition-all'>Đóng</button>
                    <button onClick={downloadExcel} className='px-3 sm:px-6 py-2 bg-[#15B392] rounded-md text-white text-lg hover:opacity-80 transition-all'>Xuất excel</button>
                    <button onClick={handleExport} className='px-3 sm:px-6  py-2 bg-[#15B392] rounded-md text-white text-lg hover:opacity-80 transition-all'>Xuất ảnh</button>
                </div>
            </div>
        </div>
    )
}

export default ReportModal