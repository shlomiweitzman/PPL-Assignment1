import { reduce, filter, map, chain } from 'ramda'

// Q2.1
export interface NumberTree {
    root: number;
    children: NumberTree[];
}

export const sumTreeIf = (t: NumberTree, p: (n: number) => boolean): number => {
    const checkP = (val: number): number => {
        if (p(val))
            return val;
        return 0;
    }
    if (t.children.length ===0)
        return checkP(t.root);
    return t.children.map(x=>sumTreeIf(x,p)).reduce((acc,curr)=>acc+curr,checkP(t.root));
}
// Q2.2
export interface WordTree {
    root: string;
    children: WordTree[];
}

export const sentenceFromTree = (t:WordTree): string => {
    if (t.children.length ===0)
        return t.root;
    return t.children.map(x=>sentenceFromTree(x)).reduce((acc,curr)=>acc.concat(" ").concat(curr),t.root);
}

// Q2.3
export interface Grade {
    course: string;
    grade: number;
}

export interface Student {
    name: string;
    gender: string;
    grades: Grade[];
}

export interface SchoolClass {
    classNumber: number;
    students: Student[];
}

type School = SchoolClass[];

// Q2.3.1
export const hasSomeoneFailedBiology = (school: School): boolean => {
    return (
        filter((x: Grade) => (x.course === 'biology' && x.grade < 56),
            chain((x: Student) => x.grades,
                chain((x: SchoolClass) => x.students, school)
            )
        )
    ).length > 0;
}

// Q2.3.2
export const allGirlsPassMath = (school: School): boolean => {
    return (
        filter((x: Grade) => (x.course === 'math' && x.grade < 56),
            chain((x: Student) => x.grades,
                chain((x: SchoolClass) => filter((y: Student) => y.gender === 'Female', x.students), school)
            )
        )
    ).length === 0;
}


// Q2.4
export interface YMDDate {
    year: number;
    month: number;
    day: number;
}

export const comesBefore: (date1: YMDDate, date2: YMDDate) => boolean = (date1, date2) => {
    if (date1.year < date2.year) {
        return true;
    }
    if (date1.year === date2.year && date1.month < date2.month) {
        return true;
    }
    if (date1.year === date2.year && date1.month === date2.month && date1.day < date2.day) {
        return true;
    }
    return false;
}

type PaymentMethod = Cash | DebitCard | Wallet

interface Cash {
    tag: "cash";
    amount: number;
}
interface DebitCard {
    tag: "dc";
    expirationDate: YMDDate;
    amount: number;
}
interface Wallet {
    tag: "wallet";
    paymentMethods: PaymentMethod[];
}
const makeCash = (amount: number): Cash => ({ tag: "cash", amount: amount });
const makeDebitCard = (amount: number, expirationDate: YMDDate): DebitCard => ({ tag: "dc", expirationDate: expirationDate, amount: amount });
const makeWallet = (paymentMethods: PaymentMethod[]): Wallet => ({ tag: "wallet", paymentMethods: paymentMethods });
const isCash = (x: any): x is Cash => x.tag === "cash";
const isDebitCard = (x: any): x is DebitCard => x.tag === "dc";
const isWallet = (x: any): x is Wallet => x.tag === "wallet";

export interface ChargeResult {
    amountLeft: number;
    wallet: Wallet;
}

export const charge = (p: PaymentMethod, amount: number, today: YMDDate): ChargeResult => {
    if (isCash(p)) {
            if (amount <= p.amount)
                return {amountLeft:0, wallet:makeWallet([makeCash(p.amount-amount)])};
            return {amountLeft:amount-p.amount, wallet:makeWallet([makeCash(0)])};
    }
    if (isDebitCard(p)) {
        if (comesBefore(today, p.expirationDate)){
            if (amount <= p.amount)
                return {amountLeft:0, wallet:makeWallet([makeDebitCard(p.amount-amount,p.expirationDate)])};
            return {amountLeft:amount-p.amount, wallet:makeWallet([makeDebitCard(0, p.expirationDate)])};
        }
        return {amountLeft: amount, wallet:makeWallet([makeDebitCard(p.amount, p.expirationDate)])};
    }
    if (isWallet(p)){
        const prevsAmount = (a:PaymentMethod):number =>{
            if(p.paymentMethods.indexOf(a)===0){
                if(isCash(a) || (isDebitCard(a) && comesBefore(today, a.expirationDate)))
                    return Math.min(amount,a.amount)
                return 0;
            }
            let b : PaymentMethod = p.paymentMethods[p.paymentMethods.indexOf(a)-1];
            if(isCash(a) || (isDebitCard(a) && comesBefore(today, a.expirationDate))){
                return Math.min(amount,a.amount+prevsAmount(b))
            }
            return prevsAmount(b);
        }
        const beforeAmount = (g:PaymentMethod):number =>{
            if(p.paymentMethods.indexOf(g)===0)
                return 0;
            return prevsAmount(p.paymentMethods[p.paymentMethods.indexOf(g)-1])
        }
        let x:PaymentMethod[] = p.paymentMethods.reduce((acc:PaymentMethod[],curr:PaymentMethod)=>acc.concat(charge(curr,amount-beforeAmount(curr),today).wallet.paymentMethods),[]);
        return {amountLeft:amount-prevsAmount(p.paymentMethods[p.paymentMethods.length-1]), wallet:makeWallet(x)};
    }
}
