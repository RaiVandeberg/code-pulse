

type PixResponse = {
    encodedImage: string;
    payload: string;
    expirationDate: string;
}

type InstallmentOptions = {
    installments: number;
    total: number;
    installmentValue: number;
    hasInterest: boolean;

}