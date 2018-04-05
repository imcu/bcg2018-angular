import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import artifacts from '../../../../truffle/build/contracts/Collectibles.json';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-bcg-collectibles',
  templateUrl: './bcg-collectibles.component.html',
  styleUrls: ['./bcg-collectibles.component.css']
})
export class BcgCollectiblesComponent implements OnInit {
  accounts: string[];
  Collectibles: any;
  deployed: any;
  web3: any;

  model = {
    balance: '',
    tokens: [],
    account: '',
    token2send: '',
    receiver: '',
  };

  status = '';

  constructor(private web3Service: Web3Service) {
    console.log('Constructor: ' + web3Service);
  }

  async ngOnInit(): Promise<void> {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.Collectibles = await this.web3Service.artifactsToContract(artifacts);
    this.web3 = this.web3Service.web3;
    this.watchAccount();

    console.log(environment.CONTRACT_ADDRESS);
    this.deployed = await this.Collectibles.at(environment.CONTRACT_ADDRESS);
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      console.log('watchAccount: ' + accounts);
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.refreshBalance().then();
    });
  }

  setStatus(status) {
    this.status = status;
  }

  async refreshBalance() {
    if (!this.web3) {
      return;
    }
    console.log('Refreshing balance');

    try {
      const balance = await this.deployed.balanceOf(this.model.account);
      // token = this.web3.toBigNumber(token).toString(16);
      console.log('Found balance: ' + balance);
      this.model.balance = balance;
      this.model.tokens = [];
      for (let i = 0; i < balance; i++) {
        let token = await this.deployed.tokenOfOwnerByIndex(this.model.account, i);
        token = '0x' + this.web3.toBigNumber(token).toString(16);
        this.model.tokens.push(token);
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  clickAddress(e) {
    this.model.account = e.target.value;
    this.refreshBalance().then();
  }

  async approveTransfer() {
    if (!this.Collectibles) {
      this.setStatus('Collectibles is not loaded, unable to send transaction');
      return;
    }

    const token2send = this.model.token2send;
    const receiver = this.model.receiver;

    console.log('Sending token' + token2send + ' to ' + receiver);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const bn = this.web3.toBigNumber(token2send);
      const transaction = await this.deployed.approve(receiver, bn, {from: this.model.account});

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  setToken2Send(e) {
    console.log('Setting tokenId to send: ' + e.target.value);
    this.model.token2send = e.target.value;
  }

  setReceiver(e) {
    console.log('Setting receiver: ' + e.target.value);
    this.model.receiver = e.target.value;
  }
}
